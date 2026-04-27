import { MessageCircle } from 'lucide-react';
import './WhatsAppButton.css'; // Let's define the pulse animation

const WhatsAppButton = () => {
  const phoneNumber = "923449058671";
  const message = "Hi! I am interested in joining Super Starter FC.";
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noreferrer" 
      className="whatsapp-btn pulse" 
      title="Chat with us"
      style={{
        position: 'fixed', bottom: 20, right: 20, width: 60, height: 60,
        background: '#25d366', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
        color: 'white', transition: 'transform 0.3s'
      }}
    >
      <MessageCircle size={32} />
    </a>
  );
};

export default WhatsAppButton;
