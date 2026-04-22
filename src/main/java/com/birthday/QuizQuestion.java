package com.example.demo;





import java.util.List;

/**
 * ══════════════════════════════════════════
 *  QuizQuestion.java
 *  ── This is a MODEL class.
 *  ── It holds the data for ONE quiz question.
 *  ── Think of it like a template/blueprint.
 * ══════════════════════════════════════════
 */
public class QuizQuestion {

    private String question;        // The question text
    private List<String> options;   // The 4 answer choices
    private int answer;             // Index of correct answer (0, 1, 2, or 3)
    private String funFact;         // Fun message shown after answering

    // ── Constructor (creates a new QuizQuestion object) ──
    public QuizQuestion(String question, List<String> options, int answer, String funFact) {
        this.question = question;
        this.options  = options;
        this.answer   = answer;
        this.funFact  = funFact;
    }

    // ── Getters (Spring Boot uses these to convert to JSON) ──
    public String getQuestion()       { return question; }
    public List<String> getOptions()  { return options;  }
    public int getAnswer()            { return answer;   }
    public String getFunFact()        { return funFact;  }

}
