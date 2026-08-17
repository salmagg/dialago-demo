import React, { useState } from 'react';
import { useApp } from '../AppContext';

export function SetupWizard() {
  const { setProfile, completeSetup } = useApp();
  
  const [localHometown, setLocalHometown] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('medical');
  const [selectedNativeLang, setSelectedNativeLang] = useState('es');
  const [selectedFocus, setSelectedFocus] = useState('speaking');

  const handleSubmit = async (e: React.FormEvent) => {
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
  };

  return (
    <div className="dialago-wizard" style={{ padding: '24px 20px', maxWidth: '480px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '6px' }}>Setup Your Profile</h2>
      <p className="muted" style={{ fontSize: '14px', marginBottom: '24px' }}>Please complete your profile details to configure your study workspace.</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* 1. HOMETOWN INPUT */}
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

        {/* 2. PROFESSION */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Profession / Focus Area</label>
          <select value={selectedProfession} onChange={(e) => setSelectedProfession(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text)' }}>
            <option value="medical" style={{ color: '#111111', background: '#ffffff' }}>Healthcare / Medical Professional</option>
            <option value="business" style={{ color: '#111111', background: '#ffffff' }}>Business / Corporate</option>
            <option value="engineering" style={{ color: '#111111', background: '#ffffff' }}>Engineering / Tech</option>
            <option value="general" style={{ color: '#111111', background: '#ffffff' }}>General Communication</option>
          </select>
        </div>

        {/* 3. NATIVE LANGUAGE */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Native Language</label>
          <select value={selectedNativeLang} onChange={(e) => setSelectedNativeLang(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text)' }}>
            <option value="es" style={{ color: '#111111', background: '#ffffff' }}>Español (Spanish)</option>
            <option value="fr" style={{ color: '#111111', background: '#ffffff' }}>Français (French)</option>
            <option value="zh" style={{ color: '#111111', background: '#ffffff' }}>中文 (Chinese)</option>
            <option value="ar" style={{ color: '#111111', background: '#ffffff' }}>العربية (Arabic)</option>
          </select>
        </div>

        {/* 4. TARGET TRACK */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Target Focus Track</label>
          <select value={selectedFocus} onChange={(e) => setSelectedFocus(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text)' }}>
            <option value="speaking" style={{ color: '#111111', background: '#ffffff' }}>Speaking Confidence & Pronunciation</option>
            <option value="writing" style={{ color: '#111111', background: '#ffffff' }}>Professional Writing & Grammar</option>
            <option value="vocabulary" style={{ color: '#111111', background: '#ffffff' }}>Medical & Technical Vocabulary</option>
          </select>
        </div>

        <button type="submit" style={{ marginTop: '12px', padding: '12px', background: 'var(--text)', color: 'var(--bg)', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '15px' }}>
          Submit
        </button>
      </form>
    </div>
  );
}