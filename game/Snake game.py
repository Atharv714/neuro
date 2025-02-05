import pygame
import random

pygame.init()

# Window dimensions
window_width = 800
window_height = 400
sidebar_width = 300  # Sidebar width
game_width = window_width - sidebar_width  # Width for the game area
window = pygame.display.set_mode((window_width, window_height))
pygame.display.set_caption('Snake DSA Game')

# Colors
white = (255, 255, 255)
green = (0, 255, 0)
red = (213, 50, 80)
blue = (50, 153, 213)
black = (0, 0, 0)

# Fonts
font_style = pygame.font.SysFont("bahnschrift", 20)
score_font = pygame.font.SysFont("comicsansms", 25)
option_font = pygame.font.SysFont("comicsansms", 18)

# DSA Questions and answers
questions = [
    {
        "question": "What is the time complexity of Binary Search?",
        "options": ["O(n)", "O(log n)", "O(n^2)", "O(1)"],
        "answer": "O(log n)"
    },
    {
        "question": "What is the space complexity of Merge Sort?",
        "options": ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
        "answer": "O(n)"
    },
    {
        "question": "What data structure does Depth First Search (DFS) use to traverse the graph?",
        "options": ["Queue", "Stack", "Array", "Linked List"],
        "answer": "Stack"
    },
    {
        "question": "Which sorting algorithm is considered the fastest in the average case?",
        "options": ["Bubble Sort", "Merge Sort", "Quick Sort", "Selection Sort"],
        "answer": "Quick Sort"
    }
]

# Snake variables
snake_block = 10
snake_speed = 15
clock = pygame.time.Clock()

# Function to display the score
def show_score(score):
    value = score_font.render("Score: " + str(score), True, white)
    window.blit(value, [10, 10])

# Function to draw the snake
def draw_snake(snake_block, snake_list):
    for x in snake_list:
        pygame.draw.rect(window, green, [x[0], x[1], snake_block, snake_block])

# Function to wrap text
def wrap_text(text, font, max_width):
    words = text.split()
    lines = []
    current_line = []
    current_width = 0

    for word in words:
        word_width, _ = font.size(word + " ")
        if current_width + word_width <= max_width:
            current_line.append(word)
            current_width += word_width
        else:
            lines.append(" ".join(current_line))
            current_line = [word]
            current_width = word_width

    if current_line:
        lines.append(" ".join(current_line))

    return lines

# Function to draw the sidebar with question and options
def draw_sidebar(question, options):
    pygame.draw.rect(window, black, [0, 0, sidebar_width, window_height])  # Sidebar background
    
    # Wrap and render question
    wrapped_question = wrap_text(question, font_style, sidebar_width - 20)
    for i, line in enumerate(wrapped_question):
        question_surface = font_style.render(line, True, white)
        window.blit(question_surface, [10, 50 + i * 25])

    # Render options
    for i, option in enumerate(options):
        option_text = option_font.render(f"{i + 1}. {option}", True, white)
        window.blit(option_text, [10, 150 + i * 30])

# Main game loop
def game_loop():
    game_over = False

    x1 = sidebar_width + game_width / 2
    y1 = window_height / 2
    x1_change = 0
    y1_change = 0
    snake_list = []
    snake_length = 1

    # Generate random question and options
    current_question = random.choice(questions)
    question_text = current_question["question"]
    correct_answer = current_question["answer"]
    options = current_question["options"]

    # Coins (representing options)
    coins = []
    for i, option in enumerate(options):
        coin = {
            "x": round(random.randrange(sidebar_width, window_width - snake_block) / 10.0) * 10.0,
            "y": round(random.randrange(0, window_height - snake_block) / 10.0) * 10.0,
            "number": i + 1,
            "is_correct": option == correct_answer
        }
        coins.append(coin)

    while True:
        while game_over:
            window.fill(black)
            message = font_style.render("Game Over! Press C to Play Again or Q to Quit", True, white)
            window.blit(message, [window_width / 2 - 200, window_height / 2 - 50])
            pygame.display.update()

            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    pygame.quit()
                    quit()
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_c:
                        game_loop()
                    elif event.key == pygame.K_q:
                        pygame.quit()
                        quit()

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                quit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_LEFT:
                    x1_change = -snake_block
                    y1_change = 0
                elif event.key == pygame.K_RIGHT:
                    x1_change = snake_block
                    y1_change = 0
                elif event.key == pygame.K_UP:
                    y1_change = -snake_block
                    x1_change = 0
                elif event.key == pygame.K_DOWN:
                    y1_change = snake_block
                    x1_change = 0

        if x1 >= window_width or x1 < sidebar_width or y1 >= window_height or y1 < 0:
            game_over = True

        x1 += x1_change
        y1 += y1_change
        window.fill(blue)

        # Draw the sidebar
        draw_sidebar(question_text, options)

        # Draw the snake
        draw_snake(snake_block, snake_list)

        # Update the snake
        snake_head = [x1, y1]
        snake_list.append(snake_head)
        if len(snake_list) > snake_length:
            del snake_list[0]

        # Collision with itself
        for block in snake_list[:-1]:
            if block == snake_head:
                game_over = True

        # Draw coins (options)
        for coin in coins:
            pygame.draw.rect(window, white, [coin["x"], coin["y"], snake_block, snake_block])
            number_surface = font_style.render(str(coin["number"]), True, black)
            window.blit(number_surface, [coin["x"] + 3, coin["y"] + 3])

        show_score(snake_length - 1)
        pygame.display.update()

        # Check for coin collision
        for coin in coins:
            if x1 == coin["x"] and y1 == coin["y"]:
                if coin["is_correct"]:
                    snake_length += 1
                else:
                    game_over = True

                # Generate new coins
                coins = []
                for i, option in enumerate(options):
                    coin = {
                        "x": round(random.randrange(sidebar_width, window_width - snake_block) / 10.0) * 10.0,
                        "y": round(random.randrange(0, window_height - snake_block) / 10.0) * 10.0,
                        "number": i + 1,
                        "is_correct": option == correct_answer
                    }
                    coins.append(coin)

        clock.tick(snake_speed)

game_loop()
