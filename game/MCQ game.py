import tkinter as tk
from tkinter import messagebox
import random

questions = [
    {
        "question": "Which of the following is a characteristic of a linked list?",
        "options": ["Random access", "Dynamic size", "Continuous memory allocation", "Fixed size"],
        "correct_answer": "Dynamic size",
        "explanation": "Linked lists can grow or shrink dynamically, unlike arrays that have a fixed size."
    },
    {
        "question": "What is the time complexity of accessing an element in an array?",
        "options": ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
        "correct_answer": "O(1)",
        "explanation": "In an array, accessing an element by index takes constant time O(1)."
    }
]

class DSACompeteGame:
    def __init__(self, root):
        self.root = root
        self.root.title("DSA Quiz Competition")
        self.root.geometry("800x600")
        self.root.configure(bg="#000000")

        self.header_frame = tk.Frame(self.root, bg="#003366", pady=10)
        self.header_frame.pack(fill=tk.X)
        
        self.label = tk.Label(self.header_frame, text="DSA Quiz Competition", font=("Arial", 20, "bold"), fg="white", bg="#003366")
        self.label.pack()

        self.question_frame = tk.Frame(self.root, bg="#000000", pady=10)
        self.question_frame.pack(fill=tk.X)
        
        self.question_label = tk.Label(self.question_frame, text="Question: (Click 'Start Game')", font=("Arial", 16), fg="white", bg="#ff0000", wraplength=700, pady=10)
        self.question_label.pack(fill=tk.X, padx=20, pady=10)
        
        self.options_frame = tk.Frame(self.root, bg="#000000", pady=20)
        self.options_frame.pack()
        
        self.option_buttons = []
        for i in range(2):
            row_frame = tk.Frame(self.options_frame, bg="#000000")
            row_frame.pack()
            for j in range(2):
                button = tk.Button(row_frame, text=f"Option {i*2 + j + 1}", font=("Arial", 14), bg="#003366", fg="white", width=30, command=lambda idx=i*2 + j: self.check_answer(idx))
                button.pack(side=tk.LEFT, padx=10, pady=5)
                self.option_buttons.append(button)
        
        self.start_button = tk.Button(self.root, text="Start Game", font=("Arial", 16, "bold"), bg="#2E6F40", fg="white", command=self.start_game)
        self.start_button.pack(pady=20)

        self.result_label = tk.Label(self.root, text="", font=("Arial", 14), fg="white", bg="#000000")
        self.result_label.pack(pady=10)

    def start_game(self):
        self.current_question = random.choice(questions)
        self.question_label.config(text=self.current_question["question"])
        
        for i in range(4):
            self.option_buttons[i].config(text=self.current_question["options"][i])
        
        self.result_label.config(text="")

    def check_answer(self, selected_option):
        selected_answer = self.current_question["options"][selected_option]
        if selected_answer == self.current_question["correct_answer"]:
            self.result_label.config(text="Correct Answer!", fg="lightgreen")
        else:
            self.result_label.config(text=f"Incorrect! Correct Answer: {self.current_question['correct_answer']}", fg="red")

if __name__ == "__main__":
    root = tk.Tk()
    game = DSACompeteGame(root)
    root.mainloop()
