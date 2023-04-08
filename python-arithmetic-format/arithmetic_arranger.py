def arithmetic_arranger(problems, show_result=False):
  if len(problems) > 5: return 'Error: Too many problems.'

  top = bottom = dashes = result = ""
  
  for problem in problems:
    parts = problem.split();
    
    if parts[1] != "+" and parts[1] != "-":
      return "Error: Operator must be '+' or '-'."

    if not parts[0].isdigit() or not parts[2].isdigit():
            return "Error: Numbers must only contain digits."

    if len(parts[0]) > 4 or len(parts[2]) > 4:
      return "Error: Numbers cannot be more than four digits."
  
    max_len = max(len(parts[0]), len(parts[2]));

    top += parts[0].rjust(max_len + 2) + "    ";
    bottom += parts[1] + " " + parts[2].rjust(max_len) + "    ";
    dashes += "-" * (max_len + 2) + "    ";

    if show_result:
      if parts[1] == "+":
          res = str(int(parts[0]) + int(parts[2]));
      else:
          res = str(int(parts[0]) - int(parts[2]));
      result += res.rjust(max_len + 2) + "    ";

    arranged_problems = top.rstrip() + "\n" + bottom.rstrip() + "\n" + dashes.rstrip()

    if show_result:
        arranged_problems += "\n" + result.rstrip()

  return arranged_problems
