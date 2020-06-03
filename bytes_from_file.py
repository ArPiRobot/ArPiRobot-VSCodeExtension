
file_path = input("Enter file name: ")
file_path = file_path.replace("\\", "/")
dir_path = file_path[0:file_path.rindex("/")]
name = file_path[file_path.rindex("/")+1:]

with open(file_path, "rb") as file:
    with open(dir_path + "/" + name + ".txt", "w") as outfile:
        i = 0
        outfile.write("[")
        b = file.read(1)
        while b:
            i += 1
            b = b[0]
            outfile.write(str(b))
            b = file.read(1)
            if b:
                outfile.write(",")
                if i == 80:
                    outfile.write("\n")
                    i = 1
            else:
                outfile.write("]")
