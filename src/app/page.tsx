'use client'

import { API_URL } from '@/constants/api.constants'
import axios from 'axios'
import { useEffect, useState } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [payload, setPayload] = useState({
    name: '',
    industry: '',
    email: '',
    phoneNumber: '',
  })

  const handleChange = (value = {}) => {
    setPayload((prev) => ({ ...prev, ...value }))
  }

  useEffect(() => {
    // SDK initialization
    if (!window?.fbAsyncInit) return
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: '1822695871933811',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v22.0',
      })
    }

    window.addEventListener('message', (event) => {
      if (!event.origin.endsWith('facebook.com')) return
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'WA_EMBEDDED_SIGNUP') {
          console.log('message event: ', data)
          /**
           *  data: {
                phone_number_id: '<CUSTOMER_BUSINESS_PHONE_NUMBER_ID>',
                waba_id: '<CUSTOMER_WABA_ID>',
                business_id: '<CUSTOMER_BUSINESS_PORTFOLIO_ID>'
              }
           */
          const { phone_number_id, waba_id } = data.data
          axios.post(`${API_URL}/business/configure`, {
            phoneNumberId: phone_number_id,
            wabaId: waba_id,
            name: payload.name,
            industry: payload.industry,
          })
        }
      } catch (err) {
        console.error('Error on message listener: ', err)
        console.log('message event: ', event.data)
        // your code goes here
      }
    })
  }, [])

  const fbLoginCallback = (response: any) => {
    if (response.authResponse) {
      const code = response.authResponse.code
      console.log('response: ', code) // remove after testing
      // your code goes here
    } else {
      console.log('response: ', response) // remove after testing
      // your code goes here
    }
  }

  const launchWhatsAppSignup = () => {
    window.FB.login(fbLoginCallback, {
      config_id: '803183145621177', // your configuration ID goes here
      response_type: 'code',
      override_default_response_type: true,
      extras: {
        setup: {},
        // featureType: '<FEATURE_TYPE>', // default onboarding
        sessionInfoVersion: '3',
      },
    })
  }

  return (
    <>
      <div className={styles.page}>
        <main className={styles.main}>
          <form className={styles.form}>
            <input
              placeholder="Business name"
              value={payload.name}
              onChange={(e) => handleChange({ name: e.target.value })}
            />
            <input
              placeholder="Industry"
              value={payload.industry}
              onChange={(e) => handleChange({ industry: e.target.value })}
            />
            <input
              placeholder="Email"
              type="email"
              value={payload.email}
              onChange={(e) => handleChange({ email: e.target.value })}
            />
            <input
              placeholder="Phone Number"
              type="tel"
              value={payload.phoneNumber}
              onChange={(e) => handleChange({ phoneNumber: e.target.value })}
            />
            <button onClick={launchWhatsAppSignup} type="button">
              Sign up
            </button>
          </form>
        </main>
      </div>

      <script
        async
        defer
        crossOrigin="anonymous"
        src="https://connect.facebook.net/en_US/sdk.js"
      ></script>
    </>
  )
}
