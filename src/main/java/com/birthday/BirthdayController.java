package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
public class BirthdayController {
	 private static final String SECRET_CODE = "5658"; // we can change here
	 
	    @GetMapping("/api/secret-code")
	    public String getSecretCode() {
	        return SECRET_CODE;
	    }

    @GetMapping("/api/quiz")
    public List<QuizQuestion> getQuiz() {
        return Arrays.asList(

            new QuizQuestion(
                "What is my favourite thing about you? 💕",
                Arrays.asList("Smile", "Caring nature", "Humor", "Everything"),
                3,
                " Ofcourse Everything kada kannaya...🌹"
            ),
            new QuizQuestion(
                "What is our favorite memory of us together? 🏡",
                Arrays.asList("Our first trip", "Taj Hotel way", "Banglore trip", "Bangalore stay"),
                1,
                "Obviously- it's Taj Hotel kada ahh 💕"
            ),
            new QuizQuestion(
                "How did I choose to celebrate Sravan's birthday this year? 🎂",
                Arrays.asList("Baked a cake 🎂", "Planned a trip ✈️", "Built a website with Spring Boot 💻", "Organised a party 🎉"),
                2,
                "I coded this entire surprise just for you! 🚀"
            ),
            new QuizQuestion(
                "What's the one quiet thing Sravan does that melts my heart? 🤍",
                Arrays.asList("His gentle smile", "The way he cares quietly", "How he makes me laugh", "His warm hugs"),
                1,
                "That quiet, thoughtful care is absolutely everything 🤍"
            ),
            new QuizQuestion(
                "What do we love most about us? 🥂",
                Arrays.asList("We do fight alwayst", "We travel together", "We laugh every single day", "We understand by our mood checks"),
                3,
                " the most beautiful thing 💕"
            )

        );
    }

    @GetMapping("/api/messages")
    public List<String> getMessages() {
        return Arrays.asList(
            "Kannaya, loving you has been the greatest thing  in my life  Kannaya🌹",
            "You are the reason ordinary days feel like celebrations. Happy Birthday, Sravan Kumar ✨",
            "Every morning I am grateful that of all the people in the world, you chose me 💕",
            "Here's to you, my love — may this year bring you all the joy you deserve 🥂",
            "They say home is a feeling. For me, home has always been you, Kannaya 🏡",
            "Happy Birthday to the man who makes me believe in everyday moments 💫"
        );
    }

}
