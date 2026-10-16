class VoiceCapture extends AudioWorkletProcessor {
 constructor(){super();this.frames=[];this.count=0;}
 process(inputs){const samples=inputs[0]?.[0];if(samples){this.frames.push(new Float32Array(samples));this.count+=samples.length;if(this.count>=2048){const block=new Float32Array(this.count);let position=0;for(const frame of this.frames){block.set(frame,position);position+=frame.length;}this.port.postMessage(block,[block.buffer]);this.frames=[];this.count=0;}}return true;}
}
registerProcessor('ctc-voice-capture',VoiceCapture);
