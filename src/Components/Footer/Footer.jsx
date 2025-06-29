import React from 'react';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneVolume, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <footer>
            <div id='contacts' className="footer_container">
                
                <a href="tel:0988055084">
                    <FontAwesomeIcon icon={faPhoneVolume} style={{ marginRight: '8px', fontSize: '18px' }} />
                    Контакти: 098 805 5084
                </a>
                <a href="https://www.instagram.com/royalskin_rivne/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faInstagram} style={{ marginRight: '8px', fontSize: '20px' }} />
                    Instagram @royalskin_rivne
                </a>
                <a href="https://maps.app.goo.gl/M3FmaoQ6hbpHt9in7" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faLocationDot} style={{ marginRight: '8px', fontSize: '20px' }} />
                    Ми на картах Рівного
                </a>
            </div>
        </footer>
    );
};

export default Footer;
