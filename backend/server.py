from fastapi import FastAPI
from functions.ai import HandleRequests

app = FastAPI()

handler = HandleRequests()
@app.get("/api/v1/ai-interact")
def ai_interact():
    return handler.send_message("test", "test", "Hello")
    

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app)