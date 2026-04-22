package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;



//We will run this class to start the server
@SpringBootApplication
public class SurpriseApplication {

	public static void main(String[] args) {
		SpringApplication.run(SurpriseApplication.class, args);
		 System.out.println("━━━━━━━━━━━━━━━");
	        System.out.println("  🎂 Kannaya Birthday App is RUNNING!");
	        System.out.println("  👉 Open: http://localhost:8080");
	        System.out.println("━━━━━━━━━━━━━");
	}

}
