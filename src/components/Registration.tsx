import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { COMMITTEES, type RegistrationData } from '../lib/types'

const REGISTRATION_FEE = 2500

export default function Registration() {
  const [form, setForm] = useState<RegistrationData>({
    full_name: '',
    email: '',
    phone: '',
    institution: '',
    delegate_type: 'ambitus_student',
    experience: '',
    preference_1: '',
    preference_2: '',
    preference_3: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const update = (field: keyof RegistrationData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const validate = (): string | null => {
    if (!form.full_name.trim()) return 'Please enter your full name.'
    if (!form.email.trim()) return 'Please enter your email address.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email address.'
    if (!form.phone.trim()) return 'Please enter your phone number.'
    if (!form.institution.trim()) return 'Please enter your institution name.'
    if (!form.preference_1) return 'Please select your first committee preference.'
    if (!form.preference_2) return 'Please select your second committee preference.'
    if (!form.preference_3) return 'Please select your third committee preference.'
    if (form.preference_1 === form.preference_2 || form.preference_1 === form.preference_3 || form.preference_2 === form.preference_3) {
      return 'Please choose three different committees for your preferences.'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setSubmitting(true)
    try {
      const { error: insertError } = await supabase.from('registrations').insert({
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        institution: form.institution.trim(),
        delegate_type: form.delegate_type,
        experience: form.experience.trim(),
        preference_1: form.preference_1,
        preference_2: form.preference_2,
        preference_3: form.preference_3,
      })

      if (insertError) throw insertError

      try {
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-to-sheets`
        await fetch(apiUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
        })
      } catch {
        // Sync is best-effort; registration itself already succeeded
      }

      setSuccess(true)
    } catch (err) {
      setError('Something went wrong while submitting your registration. Please try again.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <section className="registration" id="register">
        <div className="registration-inner">
          <div className="registration-card">
            <div className="success-screen">
              <div className="success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="success-title">Thank You for Registering!</h2>
              <p className="success-message">
                Your registration for Ambitus MUN has been received successfully. Your committee allocation will be sent to your email address shortly.
              </p>
              <div className="success-email-display">{form.email}</div>
              <br />
              <button
                className="success-register-again"
                onClick={() => {
                  setSuccess(false)
                  setForm({
                    full_name: '',
                    email: '',
                    phone: '',
                    institution: '',
                    delegate_type: 'ambitus_student',
                    experience: '',
                    preference_1: '',
                    preference_2: '',
                    preference_3: '',
                  })
                }}
              >
                Register Another Delegate
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const availableForP2 = COMMITTEES.filter((c) => c.id !== form.preference_1)
  const availableForP3 = COMMITTEES.filter((c) => c.id !== form.preference_1 && c.id !== form.preference_2)

  return (
    <section className="registration" id="register">
      <div className="registration-inner">
        <div className="section-header">
          <div className="section-eyebrow">Delegate Registration</div>
          <h2 className="section-title">Register for Ambitus MUN</h2>
          <p className="section-subtitle">
            Complete the form below to secure your spot. The registration fee is ₹{REGISTRATION_FEE.toLocaleString('en-IN')}.
          </p>
        </div>
        <div className="registration-card">
          <form onSubmit={handleSubmit}>
            {error && <div className="form-submit-error">{error}</div>}

            <div className="form-section-label">Delegate Type</div>
            <div className="delegate-type-grid">
              <div
                className={`delegate-type-option ${form.delegate_type === 'ambitus_student' ? 'selected' : ''}`}
                onClick={() => update('delegate_type', 'ambitus_student')}
              >
                <div className="delegate-type-label">Ambitus Student</div>
                <div className="delegate-type-fee">Registration Fee: ₹{REGISTRATION_FEE.toLocaleString('en-IN')}</div>
              </div>
              <div
                className={`delegate-type-option ${form.delegate_type === 'external_delegate' ? 'selected' : ''}`}
                onClick={() => update('delegate_type', 'external_delegate')}
              >
                <div className="delegate-type-label">External Delegate</div>
                <div className="delegate-type-fee">Registration Fee: ₹{REGISTRATION_FEE.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div className="form-divider"></div>

            <div className="form-section-label">Personal Information</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name <span className="required">*</span></label>
                <input
                  className="form-input"
                  type="text"
                  value={form.full_name}
                  onChange={(e) => update('full_name', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address <span className="required">*</span></label>
                <input
                  className="form-input"
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone Number <span className="required">*</span></label>
                <input
                  className="form-input"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Institution <span className="required">*</span></label>
                <input
                  className="form-input"
                  type="text"
                  value={form.institution}
                  onChange={(e) => update('institution', e.target.value)}
                  placeholder="School / College / University"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">MUN Experience</label>
              <textarea
                className="form-textarea"
                value={form.experience}
                onChange={(e) => update('experience', e.target.value)}
                placeholder="Briefly describe any prior MUN experience (optional)"
              />
            </div>

            <div className="form-divider"></div>

            <div className="form-section-label">Committee Preferences</div>
            <p className="form-hint" style={{ marginBottom: '1.5rem' }}>
              Rank your top three committee choices. We will do our best to allocate you based on your preferences.
            </p>
            <div className="form-group">
              <label className="form-label">Preference 1 (First Choice) <span className="required">*</span></label>
              <select
                className="form-select"
                value={form.preference_1}
                onChange={(e) => update('preference_1', e.target.value)}
              >
                <option value="">Select your first choice...</option>
                {COMMITTEES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Preference 2 (Second Choice) <span className="required">*</span></label>
              <select
                className="form-select"
                value={form.preference_2}
                onChange={(e) => update('preference_2', e.target.value)}
                disabled={!form.preference_1}
              >
                <option value="">Select your second choice...</option>
                {availableForP2.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Preference 3 (Third Choice) <span className="required">*</span></label>
              <select
                className="form-select"
                value={form.preference_3}
                onChange={(e) => update('preference_3', e.target.value)}
                disabled={!form.preference_2}
              >
                <option value="">Select your third choice...</option>
                {availableForP3.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <button className="form-submit" type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Complete Registration'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
