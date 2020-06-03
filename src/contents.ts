
export const robot_py: string = "\nfrom arpirobot.core.log import Logger\nfrom arpirobot.core.robot import BaseRobot\n\nimport robot_actions\nimport robot_objects\n\n\nclass Robot(BaseRobot):\n    def robot_started(self):\n        # Configure devices (motors, Arduinos, sensors, etc)\n        # Setup event callbacks here if in use\n        # Start Action's if needed here\n        pass\n\n\n    def robot_enabled(self):\n        # Run once each time the robot becomes enabled\n        pass\n\n    def robot_disabled(self):\n        # Runs once each time the robot becomes disabled\n        pass\n\n    def periodic(self):\n        # Always make sure to feed the watchdog to make sure devices don't get disabled\n        self.feed_watchdog()\n    \n    def enabled_periodic(self):\n        # Runs periodically while robot is enabled\n        pass\n\n    def disabled_periodic(self):\n        # Runs periodically while robot is disabled\n        pass\n";
export const robot_objects_py: string = "# Import the devices you will use here\n\n################################################################################\n# Constants\n################################################################################\n\n# Create constants here\n#    Motor Numbers\n#    Gamepad control numbers \n\n################################################################################\n# Devices\n################################################################################\n# Create devices here\n#    Motors\n#    DriveHelper\n#    Gamepads\n#    Arduinos\n#    Sensors";
export const robot_actions_py: string = "\nfrom arpirobot.core.log import Logger\nfrom arpirobot.core.action import Action\n\nimport robot_objects \n\n\n# Create custom actions here";
export const vscode_settings_json: string = "{\n    \"python.jediEnabled\": false,\n    \"python.linting.enabled\": true,\n    \"python.linting.mypyEnabled\": true,\n}";
export const main_sh: string = "#!/bin/bash\n\n# Change to the directory this script is in\nDIR=\"$(realpath \"$(dirname \"${BASH_SOURCE[0]}\")\")\"\ncd $DIR\n\n# Use the default python3 install to run main.py\nPYTHONPATH=. python3 -u ./main.py\n";
export const main_py: string = "from robot import Robot\nfrom arpirobot.core.robot import BaseRobot\n\n\n# Create an instance of Robot and start it\nif __name__ == \"__main__\":\n    robot = Robot()\n    BaseRobot.start_robot(robot)\n";
