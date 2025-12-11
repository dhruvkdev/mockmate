## Next Steps (Roadmap to Final Build)
The roadmap focuses on achieving an ultra-realistic, multi-faceted interview simulation and deploying sophisticated AI models for non-verbal analysis.

1.  **Phase 1: Enhanced Interview Simulation**
    * **Multi-Round Interview Logic:** Implement the feature to simulate a full hiring process, including different interview types (e.g., Technical, Behavioral, Managerial) across sequential "rounds."
    * **Real Streaming Avatar Integration:** Integrate the full Akool/Agora video streaming solution to replace the current TTS/display, enabling an interactive video interviewer for ultra-realism.
    * **Detailed Answer Recording:** Implement a robust mechanism for capturing and storing the user's video and audio responses during the session.

2.  **Phase 2: Advanced Non-Verbal Feedback**
    * **ML Model Integration (Facial Expression):** Integrate a machine learning model (e.g., a pre-trained CNN or equivalent service) to analyze the recorded video of the candidate. This will classify and extract data points on **facial expressions** (e.g., nervousness, confidence, confusion).
    * **ML Model Integration (Speaking Style/Pacing):** Integrate a model (e.g., audio analysis library like Librosa or a specialized service) to analyze the audio, focusing on **speaking style, pace, tone, and filler words**.
    * **Comprehensive Feedback Generation:** Update the feedback generation pipeline to incorporate scores and observations from the non-verbal ML models, providing feedback on technical articulation, presence, and soft skills, in addition to content.

3.  **Phase 3: Polish and Scalability**
    * Refine the content AI prompt for extremely nuanced and granular feedback scores.
    * Implement an email notification service via a final n8n node to send the complete, multi-faceted interview results to the user upon completion.