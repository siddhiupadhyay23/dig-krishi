import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Chatbot.scss';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Chatbot = () => {
  const chatbotRef = useRef(null);

  useEffect(() => {
    const chatbotElement = chatbotRef.current;

    if (chatbotElement) {
      // Check if mobile device
      const isMobile = window.innerWidth <= 768;
      const isSmallMobile = window.innerWidth <= 480;
      
      // Set responsive initial and final dimensions with scale
      let initialWidth, initialHeight, finalWidth, finalHeight, finalScale;
      
      if (isSmallMobile) {
        initialWidth = '70vw';
        initialHeight = '35vh';
        finalWidth = '100vw';
        finalHeight = '65vh';
        finalScale = 1.001; // Barely any scaling - 0.1% increase
      } else if (isMobile) {
        initialWidth = '60vw';
        initialHeight = '40vh';
        finalWidth = '100vw';
        finalHeight = '75vh';
        finalScale = 1.001; // Barely any scaling - 0.1% increase
      } else {
        initialWidth = '45vw';
        initialHeight = '50vh';
        finalWidth = '100vw';
        finalHeight = '85vh';
        finalScale = 1.002; // Barely any scaling - 0.2% increase
      }

      // Create the scroll trigger animation with transform scale
      gsap.fromTo(chatbotElement, 
        {
          width: initialWidth,
          height: initialHeight,
          scale: 1
        },
        {
          width: finalWidth,
          height: finalHeight,
          scale: finalScale,
          scrollTrigger: {
            trigger: chatbotElement,
            start: 'top bottom', // Start when chatbot enters viewport
            end: 'bottom top', // End when chatbot exits viewport
            scrub: true, // Smooth animation tied to scroll position
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={chatbotRef} className="chatbot">
      <div className="macos-panel">
        {/* macOS Window Header */}
        <div className="macos-header">
          <div className="macos-traffic-lights">
            <div className="traffic-light close"></div>
            <div className="traffic-light minimize"></div>
            <div className="traffic-light maximize"></div>
          </div>
          <div className="macos-tabs">
            <div className="tab active">
              <div className="tab-icon kripson"></div>
              <span>Kripson AI</span>
            </div>
            <div className="tab">
              <div className="tab-icon digital-krishi"></div>
              <span>Digital Krishi</span>
            </div>
            <div className="tab-add">+</div>
          </div>
          <div className="macos-controls">
            <div className="control-button">⚙</div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="macos-content">
          <div className="chat-interface">
            <div className="chat-messages">
              {/* Placeholder for chat messages */}
            </div>
            <div className="chat-input-area">
              <div className="chat-input">
                <input type="text" placeholder="Type your message..." />
                <button className="send-button">→</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;