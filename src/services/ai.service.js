
const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

const ai = new GoogleGenAI({
    apiKey: process.env.genaiApi
});

console.log("AI function call ho raha hai");

// Har question ka same structure hoga
const questionSchema = z.object({
    questions: z.string().describe(
        "The interview question."
    ),

    intentions: z.string().describe(
        "What knowledge or ability this question evaluates."
    ),

    answers: z.string().describe(
        "A correct sample answer. Do not invent candidate experience."
    )
});

// Har preparation day ka same structure hoga
const preparationSchema = z.object({
    day: z.number()
        .int()
        .min(1)
        .max(7)
        .describe("Preparation day from 1 to 7."),

    focus: z.string().describe(
        "The main topic to prepare."
    ),

    task: z.string().describe(
        "Specific practical preparation activities."
    )
});

const reportSchema = z.object({
    matchscope: z.number()
        .min(0)
        .max(100)
        .describe(
            "A realistic score showing how well the candidate matches the job."
        ),

    technicalQuestion: z.array(questionSchema)
        .length(5)
        .describe(
            "Exactly 5 technical interview questions."
        ),

    behavioralQuesttions: z.array(questionSchema)
        .length(5)
        .describe(
            "Exactly 5 behavioral interview questions."
        ),

    skillgap: z.array(
        z.object({
            skills: z.string().describe(
                "A skill gap supported by available evidence."
            ),

            level: z.enum(["low", "medium", "high"])
                .describe(
                    "The preparation priority of this skill gap."
                )
        })
    ).describe(
        "Only genuine skill gaps supported by the available information."
    ),

    preprationplan: z.array(preparationSchema)
        .length(7)
        .describe(
            "Exactly 7 preparation days."
        )
});

async function interviewAiReport({
    resume,
    selfDes,
    jobDes
}) {
  
const prompt = `
You are an expert job-specific interview preparation assistant.

Your most important rule:
THE JOB DESCRIPTION MUST CONTROL THE ENTIRE REPORT.

Analyze all candidate information carefully.

RESUME:
${resume || "Not provided"}

SELF DESCRIPTION:
${selfDes || "Not provided"}

JOB DESCRIPTION:
${jobDes}

CORE JOB RELEVANCE RULES:
- First, identify the exact job role, profession, industry, and required responsibilities from the JOB DESCRIPTION.
- Every part of the report MUST be based primarily on the JOB DESCRIPTION.
- The job description determines the subject, profession, technical domain, questions, skill gaps, and preparation activities.
- Use the resume and self-description only to understand the candidate's qualifications, skills, experience, and background.
- Never let the candidate's resume change the job role specified in the job description.
- Every question, answer, skill gap, and preparation task must be relevant to the specified job.
- Do not generate generic software, programming, web development, or REST API questions unless the job description actually requires those skills.
- If the job is a cricket player, generate cricket-related questions about the relevant playing role, batting, bowling, fielding, match awareness, fitness, or tactics as appropriate.
- If the job is a web developer, generate relevant web development questions.
- If the job is a doctor, generate questions relevant to the specified medical role and specialty.
- Apply the same rule to EVERY profession and industry, including jobs not listed in these examples.
- Do not assume every job is a technical or software job.
- If the job description is vague, use the role and requirements that can reasonably be inferred from it. Do not invent specific requirements without evidence.

Generate the complete personalized report using these rules.

1. MATCH SCORE:
- Calculate matchscope from 0 to 100.
- Evaluate the candidate against the requirements of the JOB DESCRIPTION.
- Consider relevant skills, experience, qualifications, responsibilities, and other stated requirements.
- Only count evidence relevant to this particular job.
- Do not reward unrelated skills just because they appear in the resume.
- Do not give a high score based only on keyword overlap.
- If the resume or self-description is unavailable, use the information that is available and reflect the uncertainty.
- Do not automatically give a low score just because one source is missing.

2. TECHNICAL OR ROLE-SPECIFIC QUESTIONS:
- Generate exactly 5 questions relevant to the profession and requirements in the JOB DESCRIPTION.
- These questions do not have to be software or engineering questions.
- For non-technical professions, generate appropriate professional, practical, subject-specific, or role-specific questions.
- Each question must contain:
  questions, intentions, answers.
- Each field must be a string.
- Explain what the interviewer wants to evaluate.
- Provide accurate, useful sample answers relevant to the specified job.
- Use the resume to personalize answers only when supported by the candidate's information.
- Never invent candidate experience, qualifications, achievements, or skills.
- If personal experience is unknown, provide a general sample answer without claiming it happened to the candidate.

3. BEHAVIORAL QUESTIONS:
- Generate exactly 5 behavioral interview questions appropriate to the specified job.
- Consider teamwork, communication, problem-solving, adaptability, responsibility, and other relevant competencies required by the JOB DESCRIPTION.
- Keep the scenarios and evaluation criteria relevant to the profession.
- Each question must contain:
  questions, intentions, answers.
- Each field must be a string.
- Do not invent personal experiences.
- If an actual example is unavailable, provide a general answer structure the candidate can personalize.

4. SKILL GAPS:
- Identify gaps by comparing the candidate's available evidence with the actual requirements of the JOB DESCRIPTION.
- Include only genuine or reasonably supported gaps.
- Do not list unrelated skills.
- Do not assume a skill is missing merely because it is absent from the resume.
- Each item must contain:
  skills, level.
- level must be exactly "low", "medium", or "high".
- Use "high" for urgent preparation priorities, "medium" for moderate priorities, and "low" for lower priorities.
- If no clear gaps can be identified, return an empty array.

5. PREPARATION PLAN:
- Generate exactly 7 preparation days.
- Include day numbers 1, 2, 3, 4, 5, 6, and 7 in that order.
- Each item must contain:
  day, focus, task.
- Each task must be specific, practical, and directly relevant to the JOB DESCRIPTION.
- Prioritize the actual duties, professional knowledge, skills, and competencies required for the specified job.
- Address genuine skill gaps where evidence supports them.
- Do not include generic programming, REST API, database, or web development practice unless required by the job.
- Make the plan appropriate to the candidate's profession and experience level.

IMPORTANT OUTPUT RULES:
- Return only valid JSON matching the provided schema.
- Do not include Markdown or explanations outside the JSON.
- Use these exact field names:
  matchscope, technicalQuestion, behavioralQuesttions, skillgap, preprationplan.
- Do not rename, omit, or add fields.
- technicalQuestion must contain exactly 5 objects.
- behavioralQuesttions must contain exactly 5 objects.
- Each question object must contain questions, intentions, and answers as strings.
- Each skillgap object must contain skills and level.
- skillgap may be an empty array.
- preprationplan must contain exactly 7 objects.
- Each day must be an integer from 1 to 7, without repetition.
- matchscope must be a number between 0 and 100.
- Do not invent qualifications, skills, projects, achievements, or personal experiences.
- Before returning the JSON, verify that EVERY section matches the profession specified in the JOB DESCRIPTION.
- If any question, answer, skill gap, or preparation task belongs to an unrelated profession, replace it with a relevant one.
`;


    let response;

    // Maximum 3 attempts if Gemini returns a 503 error
    for (let i = 0; i < 3; i++) {
        try {
            response = await ai.models.generateContent({
                model: "gemini-3.5-flash-lite",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseJsonSchema: z.toJSONSchema(reportSchema)
                }
            });

            break;

        } catch (error) {
            if (error.status !== 503 || i === 2) {
                throw error;
            }

            await new Promise(function(resolve) {
                setTimeout(resolve, 2000 * (i + 1));
            });
        }
    }

    if (!response || !response.text) {
        throw new Error("Gemini ne koi valid response return nahi kiya.");
    }

    // Gemini ke text ko JavaScript object mein convert karo
    const parsedResponse = JSON.parse(response.text);

    // Check karo ke response schema ke mutabiq hai
    const report = reportSchema.parse(parsedResponse);

    // Day numbers 1 se 7 tak sahi order mein hain ya nahi
    for (let i = 0; i < report.preprationplan.length; i++) {
        if (report.preprationplan[i].day !== i + 1) {
            throw new Error(
                "Preparation plan ke days 1 se 7 tak order mein hone chahiye."
            );
        }
    }

    console.log("Report successfully validated.");

    return report
}

module.exports = interviewAiReport;
