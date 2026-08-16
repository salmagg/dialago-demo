import React, { useState } from 'react';
import { useApp } from '../AppContext';

export function ProfileDashboard() {
  const { profile, setProfile, completeSetup } = useApp();
  
  const [isOnboardingDone, setIsOnboardingDone] = useState(() => !!localStorage.getItem('dialago-onboarding-complete'));
  const [localHometown, setLocalHometown] = useState(() => localStorage.getItem('dialago-user-hometown') || '');

  const [selectedProfession, setSelectedProfession] = useState(profile.profession || 'medical');
  const [selectedNativeLang, setSelectedNativeLang] = useState(profile.nativeLanguage || 'es');
  const [selectedFocus, setSelectedFocus] = useState(profile.focus || 'speaking');

  const handleSaveOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localHometown.trim()) {
      alert("Please fill in your Hometown before proceeding.");
      return;
    }
    
    localStorage.setItem('dialago-user-hometown', localHometown.trim());
    localStorage.setItem('dialago-onboarding-complete', 'true');
    
    setProfile(prev => ({
      ...prev,
      profession: selectedProfession,
      nativeLanguage: selectedNativeLang,
      focus: selectedFocus
    }));

    if (completeSetup) {
      await completeSetup();
    }
    
    setIsOnboardingDone(true);
  };

  // 1. ONBOARDING VIEW (Only Hometown + Demographics)
  if (!isOnboardingDone) {
    return (
      <div className="dialago-profile" style={{ padding: '24px 20px', maxWidth: '480px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '6px' }}>Setup Your Profile</h2>
        <p className="muted" style={{ fontSize: '14px', marginBottom: '24px' }}>Please complete your profile details to configure your study workspace.</p>
        
        <form onSubmit={handleSaveOnboarding} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* HOMETOWN MANUALLY ENTERED */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Hometown</label>
            <input 
              type="text" 
              required
              value={localHometown} 
              onChange={(e) => setLocalHometown(e.target.value)}
              placeholder="Enter your hometown..." 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Profession / Focus Area</label>
            <select value={selectedProfession} onChange={(e) => setSelectedProfession(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)' }}>
              <option value="medical">Healthcare / Medical Professional</option>
              <option value="business">Business / Corporate</option>
              <option value="engineering">Engineering / Tech</option>
              <option value="general">General Communication</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Native Language</label>
            <select value={selectedNativeLang} onChange={(e) => setSelectedNativeLang(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)' }}>
              <option value="es">Español (Spanish)</option>
              <option value="fr">Français (French)</option>
              <option value="zh">中文 (Chinese)</option>
              <option value="ar">العربية (Arabic)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Target Focus Track</label>
            <select value={selectedFocus} onChange={(e) => setSelectedFocus(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)' }}>
              <option value="speaking">Speaking Confidence & Pronunciation</option>
              <option value="writing">Professional Writing & Grammar</option>
              <option value="vocabulary">Medical & Technical Vocabulary</option>
            </select>
          </div>

          {/* FIXED SUBMIT BUTTON TEXT */}
          <button type="submit" style={{ marginTop: '12px', padding: '12px', background: 'var(--text)', color: 'var(--bg)', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '15px' }}>
            Submit
          </button>
        </form>
      </div>
    );
  }

  // 2. DASHBOARD VIEW (Only shows Saved Demographic Info - No Quiz/No Words)
  return (
    <div className="dialago-profile" style={{ padding: '24px 16px', maxWidth: '480px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '16px' }}>Your Profile Dashboard</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <div>
          <span className="muted" style={{ fontSize: '12px', display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>Hometown</span>
          <strong style={{ fontSize: '16px' }}>{localHometown}</strong>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0' }} />
        <div>
          <span className="muted" style={{ fontSize: '12px', display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>Profession</span>
          <strong style={{ fontSize: '16px', textTransform: 'capitalize' }}>{selectedProfession}</strong>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0' }} />
        <div>
          <span className="muted" style={{ fontSize: '12px', display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>Native Language</span>
          <strong style={{ fontSize: '16px', textTransform: 'uppercase' }}>{selectedNativeLang}</strong>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0' }} />
        <div>
          <span className="muted" style={{ fontSize: '12px', display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>Focus Track</span>
          <strong style={{ fontSize: '16px', textTransform: 'capitalize' }}>{selectedFocus}</strong>
        </div>
      </div>
      
      <button 
        onClick={() => {
          localStorage.removeItem('dialago-onboarding-complete');
          setIsOnboardingDone(false);
        }}
        style={{ marginTop: '20px', background: 'none', border: 'none', color: 'gray', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' }}
      >
        Edit Profile Info
      </button>
    </div>
  );
}
