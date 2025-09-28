from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI()


# Enable CORS so the React frontend (on localhost ports) can call the API
app.add_middleware(
CORSMiddleware,
allow_origins=["http://localhost:5173", "http://localhost:3000"],
allow_credentials=True,
allow_methods=["*"],
allow_headers=["*"],
)


# Pydantic model for incoming data (what client sends)
class ProfileIn(BaseModel):
    name: str
    email: str
    phone: str
    bio: str = ""


# Pydantic model for stored/returned data (includes id)
class Profile(ProfileIn):
    id: int


# In-memory storage: a list of Profile objects
profiles: List[Profile] = []


# Helper to find an index by id
def _find_index(profile_id: int):
    for i, p in enumerate(profiles):
        if p.id == profile_id:
            return i
        return None


@app.get("/profiles", response_model=List[Profile])
def get_profiles():
    """Return all profiles"""
    return profiles


@app.post("/profiles", response_model=Profile)
def create_profile(payload: ProfileIn):
    """Create a new profile with an incremental id"""
    new_id = profiles[-1].id + 1 if profiles else 1
    profile = Profile(id=new_id, **payload.dict())
    profiles.append(profile)
    return profile


@app.delete("/profiles/{profile_id}")
def delete_profile(profile_id: int):
    """Delete profile by id"""
    idx = _find_index(profile_id)
    if idx is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    profiles.pop(idx)
    return {"message": "Profile deleted"}