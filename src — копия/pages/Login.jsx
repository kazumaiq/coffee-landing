import React, { useState } from 'react'
import axios from 'axios'
import { useI18n } from '../i18n'

export default function Login(){
  const { t } = useI18n()
  const [country,setCountry]=useState('+996')
  const [phone,setPhone]=useState('')

  const login = async ()=>{
    if(!phone) return alert(t('auth.enterPhone'))
    const res = await axios.post('/api/users/login',{ phone: country+phone })
    localStorage.setItem('user', JSON.stringify(res.data))
    window.location.href='/'
  }

  return (
    <div className="container">
      <h2>{t('auth.login')}</h2>
      <div className="form">
        <div style={{display:'flex',gap:8}}>
          <select value={country} onChange={e=>setCountry(e.target.value)}>
            <option value="+996">Kyrgyzstan +996</option>
            <option value="+7">Russia +7</option>
            <option value="+998">Uzbekistan +998</option>
          </select>
          <input placeholder={t('auth.enterPhone')} value={phone} onChange={e=>setPhone(e.target.value)} type="tel" required />
        </div>
        <button className="btn-primary" onClick={login}>{t('auth.login')}</button>
      </div>
    </div>
  )
}
