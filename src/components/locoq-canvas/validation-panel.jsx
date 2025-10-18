import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, ShieldCheck, Cpu } from 'lucide-react';

const qpus = [
    { id: 'ibm_eagle', name: 'IBM Eagle', qubits: 127, fidelity: '99.5%', rank: 1, available: true },
    { id: 'google_sycamore', name: 'Google Sycamore', qubits: 72, fidelity: '99.7%', rank: 2, available: true },
    { id: 'rigetti_aspen', name: 'Rigetti Aspen-M', qubits: 80, fidelity: '99.2%', rank: 3, available: false },
    { id: 'ionq_aria', name: 'IonQ Aria', qubits: 25, fidelity: '99.8%', rank: 4, available: true },
    { id: 'quantinuum_h1', name: 'Quantinuum H1', qubits: 20, fidelity: '99.9%', rank: 5, available: false },
];

export default function ValidationPanel({ selectedQPU, setSelectedQPU, onRun }) {

    return (
        <div className="h-full glass-card rounded-2xl p-4 flex flex-col">
            <h2 className="text-white font-bold text-lg mb-4 px-2">Validation & Run</h2>

            <div className="glass-card rounded-xl p-4 mb-4 flex-1 overflow-y-auto">
                <h3 className="text-white/80 font-semibold mb-3">Available Quantum Computers</h3>
                <div className="space-y-2">
                    {qpus.map(qpu => (
                        <div key={qpu.id} className="glass rounded-lg p-3 flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium text-sm">{qpu.rank}. {qpu.name}</p>
                                <p className="text-white/50 text-xs">{qpu.qubits} Qubits • {qpu.fidelity} Fidelity</p>
                            </div>
                            <div className={`w-2.5 h-2.5 rounded-full ${qpu.available ? 'bg-green-400' : 'bg-red-500'}`} title={qpu.available ? 'Available' : 'Unavailable'}></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-3 mt-auto">
                <Button className="w-full glass text-white hover:bg-white/10">
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Validate Circuit
                </Button>

                <div className="space-y-2">
                    <label className="text-white/70 text-sm px-2">Select QPU to run on:</label>
                    <Select value={selectedQPU} onValueChange={setSelectedQPU}>
                        <SelectTrigger className="w-full glass text-white border-white/20">
                            <SelectValue placeholder="Select QPU" />
                        </SelectTrigger>
                        <SelectContent className="glass-card text-white border-white/20">
                            {qpus.filter(q => q.available).map(qpu => (
                                <SelectItem key={qpu.id} value={qpu.id} className="focus:bg-white/10">
                                    <div className="flex items-center gap-2">
                                        <Cpu className="w-4 h-4 text-cyan-400" /> {qpu.name}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Button onClick={onRun} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                    <Play className="w-4 h-4 mr-2" />
                    Run on QPU
                </Button>
            </div>
        </div>
    );
}