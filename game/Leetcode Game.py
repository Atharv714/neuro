import tkinter as tk
from tkinter import messagebox, scrolledtext, ttk
import random

questions = [
    {"question": "Find the missing number in the array.", "difficulty": "Easy", "test_case": "[1, 2, 3, 4, 6] -> Missing number is 5", "solution": "Use the sum formula n*(n+1)//2 and subtract the sum of the array elements."},
    {"question": "Find the longest increasing subsequence in an array.", "difficulty": "Medium", "test_case": "[10, 22, 9, 33, 21, 50, 41, 60, 80] -> Longest increasing subsequence is [10, 22, 33, 50, 60, 80]", "solution": "Use dynamic programming to store the length of LIS ending at each index."},
    {"question": "Implement LRU Cache.", "difficulty": "Hard", "test_case": "Set cache capacity = 2. Operations: set(1, 1), set(2, 2), get(1) -> returns 1, set(3, 3), get(2) -> returns -1.", "solution": "Use an ordered dictionary to store cache elements with constant time complexity."}
]

class DSAQuizGame:
    def __init__(self, root):
        self.root = root
        self.root.title("DSA Quiz Adventure")
        self.root.geometry("1000x600")
        self.root.configure(bg="#121212")

        # Sidebar for questions
        self.sidebar = tk.Frame(self.root, bg="#1E3A5F", width=300)
        self.sidebar.pack(side=tk.LEFT, fill=tk.Y)

        self.label = tk.Label(self.sidebar, text="DSA Quiz Adventure!", font=("Comic Sans MS", 16, "bold"), fg="white", bg="#1E3A5F")
        self.label.pack(pady=10)

        self.question_label = tk.Label(self.sidebar, text="Question: ", font=("Comic Sans MS", 12), fg="white", bg="#1E3A5F", wraplength=280, justify=tk.LEFT)
        self.question_label.pack(pady=10)

        self.test_case_label = tk.Label(self.sidebar, text="Test Case: ", font=("Comic Sans MS", 10), fg="white", bg="#1E3A5F", wraplength=280, justify=tk.LEFT)
        self.test_case_label.pack(pady=10)

        self.start_button = tk.Button(self.sidebar, text="Start Game", command=self.start_game, font=("Comic Sans MS", 12, "bold"), bg="#388E3C", fg="white", pady=5)
        self.start_button.pack(pady=20)

        self.solution_button = tk.Button(self.sidebar, text="Show Solution", command=self.show_solution, font=("Comic Sans MS", 12, "bold"), bg="#F44336", fg="white", pady=5)
        self.solution_button.pack(pady=10)

        # Main area for code and output
        self.main_frame = tk.Frame(self.root, bg="#121212")
        self.main_frame.pack(side=tk.RIGHT, expand=True, fill=tk.BOTH)

        self.code_area = scrolledtext.ScrolledText(self.main_frame, width=70, height=15, font=("Courier New", 12), bg="#2C2C2C", fg="white", insertbackground="white")
        self.code_area.pack(pady=10)

        self.run_button = tk.Button(self.main_frame, text="Run Code", command=self.run_code, font=("Comic Sans MS", 12, "bold"), bg="#1976D2", fg="white", pady=5)
        self.run_button.pack(pady=5)

        self.output_area = tk.Text(self.main_frame, width=70, height=8, font=("Courier New", 12), bg="#121212", fg="#00FF00", state="disabled", wrap=tk.WORD)
        self.output_area.pack(pady=10)

    def start_game(self):
        self.current_question = random.choice(questions)
        self.question_label.config(text=f"Question: {self.current_question['question']}")
        self.test_case_label.config(text=f"Test Case: {self.current_question['test_case']}")
        self.code_area.delete("1.0", tk.END)
        self.output_area.config(state="normal")
        self.output_area.delete("1.0", tk.END)
        self.output_area.config(state="disabled")

    def run_code(self):
        user_code = self.code_area.get("1.0", tk.END)
        self.output_area.config(state="normal")
        self.output_area.delete("1.0", tk.END)
        try:
            exec(user_code, {})
        except Exception as e:
            self.output_area.insert(tk.END, f"Error: {str(e)}")
        self.output_area.config(state="disabled")

    def show_solution(self):
        if self.current_question:
            messagebox.showinfo("Solution", self.current_question["solution"])

if __name__ == "__main__":
    root = tk.Tk()
    game = DSAQuizGame(root)
    root.mainloop()
