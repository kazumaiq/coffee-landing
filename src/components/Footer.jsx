import React from 'react'
import { useI18n } from '../i18n'

export default function Footer(){
  const { t } = useI18n()

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Coffee Land</h3>
          <p className="footer-tagline">{t('footer.tagline')}</p>
        </div>

        <div className="footer-section">
          <h4><span className="footer-icon">📍</span> {t('footer.addressTitle')}</h4>
          <p className="footer-address">{t('footer.addressLine1')}</p>
          <p className="footer-address">{t('footer.addressLine2')}</p>
        </div>

        <div className="footer-section">
          <h4><span className="footer-icon">☎</span> {t('footer.orderTitle')}</h4>
          <a className="footer-phone" href="tel:+996504633522">+996 504-63-35-22</a>
          <p className="footer-note">{t('footer.orderNote')}</p>
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">
        © 2026 Coffee Land. {t('footer.bottomNote')}
      </div>
    </footer>
  )
}
