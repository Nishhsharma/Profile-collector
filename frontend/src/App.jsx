import React, { useEffect, useState } from 'react'
import axios from 'axios'


const API_BASE = 'http://127.0.0.1:8000' // backend base URL


export default function App() {
  const [profiles, setProfiles] = useState([])
  const [form, setForm] = useState({ name: '', email: '', phone: '', bio: '' })
  const [loading, setLoading] = useState(false)


// fetch profiles from backend
   const fetchProfiles = async () => {
    try {
      const res = await axios.get(`${API_BASE}/profiles`)
      setProfiles(res.data)
    } catch (err) {
      console.error('Fetch failed', err)
    }
  }
  
  useEffect(() => {
    fetchProfiles()
  }, [])
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(`${API_BASE}/profiles`, form)
      setProfiles((p) => [res.data, ...p])
      setForm({ name: '', email: '', phone: '', bio: '' })
    } catch (err) {
      console.error('Submit failed', err)
      alert('Failed to submit. Check backend is running.')
    } finally {
      setLoading(false)
    }
  }
  
   const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/profiles/${id}`)
      setProfiles((p) => p.filter((x) => x.id !== id))
    } catch (err) {
      console.error('Delete failed', err)
    }
  }


return (
<div className="container">
  <header className="hero">
    <h1>Profile Collector</h1>
    <p>Quick, attractive form to collect basic info — built with React + FastAPI.</p>
    </header>


<main className="card-grid">
<section className="form-card">
<form onSubmit={handleSubmit}>
<input name="name" value={form.name} onChange={handleChange} placeholder="Full name" required />
<input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required />
<input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" required />
<textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Short bio (optional)" />
<button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Submit'}</button>
</form>
</section>


<section className="list-card">
<h2>Saved Profiles</h2>
<div className="profiles">
{profiles.length === 0 && <p className="muted">No profiles yet — add one!</p>}
{profiles.map((p) => (
<article key={p.id} className="profile">
<div className="avatar">{p.name.charAt(0).toUpperCase()}</div>
<div className="meta">
<h3>{p.name}</h3>
<p className="small">{p.email} • {p.phone}</p>
<p className="bio">{p.bio}</p>
</div>
<button className="del" onClick={() => handleDelete(p.id)}>Delete</button>
</article>
))}
</div>
</section>
</main>
</div>
)
}