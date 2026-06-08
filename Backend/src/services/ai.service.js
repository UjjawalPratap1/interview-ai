const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = z.object({
    match_score: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
    technical_questions: z.array(z.string()).describe("An array of likely technical interview questions"),
    technical_questions_details: z.array(z.string()).optional().describe("A matching array of detailed intentions and answers for the technical questions"),
    behavioral_questions: z.array(z.string()).describe("An array of likely behavioral interview questions"),
    behavioral_questions_details: z.array(z.string()).optional().describe("A matching array of detailed intentions and answers for the behavioral questions"),
    skill_gaps: z.array(z.string()).describe("An array of skill gaps identified from the resume and job description"),
    skill_gaps_severity: z.array(z.string()).optional().describe("An array of severity levels corresponding to the identified skill gaps"),
    preparation_plan: z.array(z.string()).describe("An array of day-wise preparation tasks for the interview"),
    title: z.string().describe("The job title extracted from the job description")


})

function parseDetailText(detailText) {
    const text = String(detailText || '').trim();
    const match = text.match(/Intention\s*:\s*(.*?)\s*Answer\s*:\s*(.*)$/is);
    if (match) {
        return {
            intention: match[1].trim(),
            answer: match[2].trim()
        };
    }

    return {
        intention: '',
        answer: text
    };
}

function parsePreparationPlanItem(itemText) {
    const text = String(itemText || '').trim();
    const dayMatch = text.match(/^(Day\s*\d+)(?:\s*[:\-])\s*(.*)$/i);
    const day = dayMatch ? dayMatch[1].trim() : '';
    const rest = dayMatch ? dayMatch[2].trim() : text;

    const taskSplit = rest.split(/Tasks?\s*:\s*/i);
    if (taskSplit.length > 1) {
        const focusPart = taskSplit[0].trim();
        const tasksPart = taskSplit.slice(1).join('Tasks: ').trim();
        return {
            day,
            focus: focusPart || rest,
            tasks: tasksPart || focusPart || rest
        };
    }

    const focusMatch = rest.match(/^(Focus\s*[:\-]?\s*)(.*)$/i);
    if (focusMatch) {
        const focusPart = focusMatch[2].trim();
        const sentences = focusPart.split(/(?:\.|\?|!)\s+/).filter(Boolean);
        if (sentences.length > 1) {
            return {
                day,
                focus: sentences[0].trim(),
                tasks: sentences.slice(1).join('. ').trim() || sentences[0].trim()
            };
        }
        return {
            day,
            focus: focusPart,
            tasks: focusPart
        };
    }

    const sentences = rest.split(/(?:\.|\?|!)\s+/).filter(Boolean);
    if (sentences.length > 1) {
        return {
            day,
            focus: sentences[0].trim(),
            tasks: sentences.slice(1).join('. ').trim() || sentences[0].trim()
        };
    }

    return {
        day,
        focus: rest,
        tasks: rest
    };
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `You are an expert career coach. Based on the following job description, candidate's resume and self-description, generate a comprehensive interview report as valid JSON only. The response MUST be a JSON object with exactly these keys: match_score, technical_questions, technical_questions_details, behavioral_questions, behavioral_questions_details, skill_gaps, skill_gaps_severity, preparation_plan, title.

1. match_score: number between 0 and 100.
2. technical_questions: array of question strings.
3. technical_questions_details: array of strings, each containing intention and answer for the corresponding technical question.
4. behavioral_questions: array of question strings.
5. behavioral_questions_details: array of strings, each containing intention and answer for the corresponding behavioral question.
6. skill_gaps: array of strings describing gaps.
7. skill_gaps_severity: array of strings containing Low/Medium/High values for each gap.
8. preparation_plan: array of strings describing day-wise tasks.
9. title: a short job title extracted from the job description.

resume: ${resume}
selfDescription: ${selfDescription}
Job Description:
${jobDescription}`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
            {
                type: "text",
                text: prompt
            }
        ],
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema)
        }
    });

    const parsed = JSON.parse(response.text);

    const technicalQuestions = (parsed.technical_questions || []).map((question, index) => {
        const detail = parsed.technical_questions_details?.[index] ?? '';
        const { intention, answer } = parseDetailText(detail);
        return {
            question,
            intention,
            answer
        };
    });

    const behavioralQuestions = (parsed.behavioral_questions || []).map((question, index) => {
        const detail = parsed.behavioral_questions_details?.[index] ?? '';
        const { intention, answer } = parseDetailText(detail);
        return {
            question,
            intention,
            answer
        };
    });

    const skillGaps = (parsed.skill_gaps || []).map((skill, index) => ({
        skill,
        severity: parsed.skill_gaps_severity?.[index] ?? 'Medium'
    }));

    const preparationPlan = (parsed.preparation_plan || []).map((item) => parsePreparationPlanItem(item));

    function extractTitleFromJobDescription(jobDescription) {
    if (!jobDescription) return 'Interview Report';
    const titleMatch = jobDescription.match(/Position\s*:\s*(.+)/i);
    if (titleMatch) {
        return titleMatch[1].split(/\r?\n/)[0].trim();
    }
    const firstLine = jobDescription.split(/\r?\n/).find((line) => line.trim());
    return firstLine ? firstLine.trim() : 'Interview Report';
}

    const normalized = {
        matchScore: parsed.matchScore ?? parsed.match_score,
        technicalQuestions,
        behavioralQuestions,
        skillGaps,
        preparationPlan,
        title: parsed.title || parsed.jobTitle || extractTitleFromJobDescription(jobDescription)
    };

    console.log(response.text);
    return normalized;

}

module.exports = generateInterviewReport;

