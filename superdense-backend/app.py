from flask import Flask, request, jsonify
from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister, transpile
from qiskit_aer import AerSimulator
from qiskit.quantum_info import Statevector, DensityMatrix
from qiskit.visualization import plot_bloch_multivector, plot_histogram
import matplotlib.pyplot as plt
import numpy as np
import base64
from io import BytesIO
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# --- Helper: Convert Matplotlib plot to base64 string ---
def fig_to_base64(fig):
    buf = BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight")
    buf.seek(0)
    encoded = base64.b64encode(buf.read()).decode("utf-8")
    plt.close(fig)
    return encoded

# --- Circuit Builders and Simulation ---
def build_unitary_circuit(message):
    q = QuantumRegister(2, "q")
    circuit = QuantumCircuit(q)
    circuit.h(q[0])
    circuit.cx(q[0], q[1])
    if message == "01":
        circuit.x(q[0])
    elif message == "10":
        circuit.z(q[0])
    elif message == "11":
        circuit.x(q[0])
        circuit.z(q[0])
    return circuit

def superdense_coding(message, with_eve=False):
    q = QuantumRegister(2, "q")
    c = ClassicalRegister(2, "c")
    circuit = QuantumCircuit(q, c)

    circuit.h(q[0])
    circuit.cx(q[0], q[1])
    circuit.barrier(label="Entangle")

    if message == "01":
        circuit.x(q[0])
    elif message == "10":
        circuit.z(q[0])
    elif message == "11":
        circuit.x(q[0])
        circuit.z(q[0])
    circuit.barrier(label="Encode")

    if with_eve:
        eve_classical = ClassicalRegister(1, "eve")
        circuit.add_register(eve_classical)
        circuit.measure(q[0], eve_classical[0])
        circuit.x(q[0]).c_if(eve_classical, 1)
        circuit.barrier(label="Eve Attack")

    circuit.cx(q[0], q[1])
    circuit.h(q[0])
    circuit.measure([q[0], q[1]], c)

    return circuit

def run_simulation(qc, shots=1024):
    backend = AerSimulator()
    tqc = transpile(qc, backend)
    result = backend.run(tqc, shots=shots).result()
    return result.get_counts(), result

# --- Flask Route ---
@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    message = data.get("message")
    include_eve = data.get("include_eve", False)

    if message not in ["00", "01", "10", "11"]:
        return jsonify({"error": "Invalid message. Use 00, 01, 10, or 11."}), 400

    unitary_circuit = build_unitary_circuit(message)
    sv = Statevector(unitary_circuit)
    dm_no_eve = DensityMatrix(sv)

    fig_bloch = plot_bloch_multivector(sv)
    bloch_img = fig_to_base64(fig_bloch)

    statevector_data = {
        basis: f"{amp.real:.3f} + {amp.imag:.3f}j"
        for basis, amp in sv.to_dict().items()
    }

    qc_secure = superdense_coding(message, with_eve=False)
    counts_secure, _ = run_simulation(qc_secure)
    fig_secure_hist = plot_histogram(counts_secure, title="✅ No Eve")
    secure_hist_img = fig_to_base64(fig_secure_hist)
    secure_circuit_img = fig_to_base64(qc_secure.draw("mpl"))

    if include_eve:
        qc_eve = superdense_coding(message, with_eve=True)
        counts_eve, _ = run_simulation(qc_eve)
        fig_eve_hist = plot_histogram(counts_eve, title="❌ With Eve")
        eve_hist_img = fig_to_base64(fig_eve_hist)
        eve_circuit_img = fig_to_base64(qc_eve.draw("mpl"))

        I = np.eye(2)
        P0 = np.array([[1, 0], [0, 0]])
        P1 = np.array([[0, 0], [0, 1]])
        M0 = np.kron(P0, I)
        M1 = np.kron(P1, I)
        dm_after_eve = M0 @ dm_no_eve.data @ M0.T + M1 @ dm_no_eve.data @ M1.T
        dm_after_eve = np.round(dm_after_eve, 3).tolist()
    else:
        eve_hist_img = None
        eve_circuit_img = None
        dm_after_eve = None

    dm_no_eve = np.round(dm_no_eve.data, 3).tolist()

    return jsonify({
        "message": message,
        "include_eve": include_eve,
        "statevector": statevector_data,
        "bloch_sphere_img": bloch_img,
        "secure": {
            "histogram_img": secure_hist_img,
            "circuit_img": secure_circuit_img,
            "counts": counts_secure
        },
        "eve": {
            "histogram_img": eve_hist_img,
            "circuit_img": eve_circuit_img,
            "counts": counts_eve if include_eve else None
        },
        "density_matrix": {
            "no_eve": dm_no_eve,
            "with_eve": dm_after_eve
        }
    })

if __name__ == '__main__':
    app.run(debug=True)
    