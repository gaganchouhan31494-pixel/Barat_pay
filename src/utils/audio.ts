// Audio synthesizer for Paytm/PhonePe soundbox notifications & UPI beeps
import confetti from 'canvas-confetti';

class SoundService {
  private ctx: AudioContext | null = null;
  public speechEnabled = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Realistic celebration confetti burst
  triggerConfetti() {
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#06b6d4']
      });
    } catch {
      // Ignore if canvas not supported
    }
  }

  // Play pleasant UPI success chime (like PhonePe / Google Pay / Paytm sound)
  playSuccess() {
    this.playSuccessChime();
  }

  playSuccessChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // PhonePe / Paytm style double harmonic bell
      const notes = [587.33, 739.99, 880.00, 1174.66]; // D5, F#5, A5, D6
      
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.22, now + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.55);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.6);
      });
    } catch {
      // Audio autoplay might be restricted before interaction
    }
  }

  // Play crisp keypad click
  playClick() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(850, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(280, this.ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // silent catch
    }
  }

  // Play error buzz
  playError() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.setValueAtTime(110, now + 0.1);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch {
      // silent catch
    }
  }

  // Voice announcement like PhonePe / Paytm SmartBox
  announcePayment(amount: number, type: 'ADD' | 'RECEIVE' | 'LOAN' | 'SEND' = 'RECEIVE', lang: 'hi' | 'en' | 'bg' = 'hi') {
    this.playSuccessChime();
    this.triggerConfetti();

    if (!this.speechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech

      let text = '';
      if (type === 'ADD') {
        if (lang === 'bg') {
          text = `भारत पे वॉलेट मां ${amount} रूप्या लोड हो ग्या!`;
        } else if (lang === 'hi') {
          text = `भारत पे वॉलेट में ${amount} रुपये लोड हो गए हैं`;
        } else {
          text = `Rupees ${amount} successfully added to BharatPay wallet`;
        }
      } else if (type === 'LOAN') {
        if (lang === 'bg') {
          text = `मुबारक हो गगन जी! ${amount} रूप्या रो लोन थारे वॉलेट मां सीधो जमा हो ग्यो!`;
        } else if (lang === 'hi') {
          text = `बधाई हो गगन जी! ${amount} रुपये का लोन आपके भारत पे वॉलेट में तुरंत जमा हो गया है`;
        } else {
          text = `Congratulations Gagan! Loan of Rupees ${amount} is approved and credited to your wallet`;
        }
      } else if (type === 'SEND') {
        if (lang === 'bg') {
          text = `${amount} रूप्या रो पेमेंट सफ़ल हो ग्यो`;
        } else if (lang === 'hi') {
          text = `${amount} रुपये का पेमेंट सफलतापूर्वक हो गया है`;
        } else {
          text = `Payment of Rupees ${amount} is successful`;
        }
      } else {
        if (lang === 'bg') {
          text = `भारत पे माथे ${amount} रूप्या प्राप्त होया!`;
        } else if (lang === 'hi') {
          text = `भारत पे पर ${amount} रुपये प्राप्त हुए`;
        } else {
          text = `Received Rupees ${amount} on BharatPay`;
        }
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN') || v.lang.includes('hi-IN'));
      if (hindiVoice && (lang === 'hi' || lang === 'bg')) {
        utterance.voice = hindiVoice;
      }
      
      // Delay speech slightly so the chime plays first
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 420);
    } catch {
      // Ignore speech errors
    }
  }
}

export const soundService = new SoundService();

