import React, { useState } from 'react'
import axios from 'axios'
import { useI18n } from '../i18n'

export default function Register(){
  const { t } = useI18n()
  const [name,setName]=useState('')
  const [country,setCountry]=useState('+996')
  const [phone,setPhone]=useState('')

  const register = async ()=>{
    if(!phone) return alert(t('auth.enterPhone'))
    const res = await axios.post('/api/users/login',{ name, phone: country+phone })
    localStorage.setItem('user', JSON.stringify(res.data))
    window.location.href='/'
  }

  return (
    <div className="container">
      <h2>{t('auth.register')}</h2>
      <div className="form">
        <input placeholder={t('auth.enterName')} value={name} onChange={e=>setName(e.target.value)} required />
        <div style={{display:'flex',gap:8}}>
          <select value={country} onChange={e=>setCountry(e.target.value)}>
            <option value="+996">Kyrgyzstan +996</option>
            <option value="+7">Russia +7</option>
            <option value="+998">Uzbekistan +998</option>
          </select>
          <input placeholder={t('auth.enterPhone')} value={phone} onChange={e=>setPhone(e.target.value)} type="tel" required />
        </div>
        <button className="btn-primary" onClick={register}>{t('auth.register')}</button>
      </div>
    </div>
  )
}
