from arpirobot.core.robot import BaseRobot
from arpirobot.core.log import Logger
from arpirobot.core.action import ActionManager
from arpirobot.core.network import NetworkTable

# Import devices and other things here

# Import actions here
# from actions import ...

class Robot(BaseRobot):
    def __init__(self):
        # Do not remove this line
        super().__init__()

        # Create devices and constants as member variables here
        # self.device_var = DeviceClass(args)

        # Only create the devices here. Do not configure them here!
    
    def robot_started(self):
        # Run once when the robot starts
        # Configure devices here
        pass

    def robot_enabled(self):
        # Runs once each time the robot becomes enabled
        pass

    def robot_disabled(self):
        # Runs once each time the robot becomes disabled
        pass

    def enabled_periodic(self):
        # Runs periodically while the robot is enabled
        pass

    def disabled_periodic(self):
        # Runs periodically while the robot is disabled
        pass

    def periodic(self):
        # Runs periodically (regardless of robot state)

        # Do not remove this line or some devices will be disabled
        self.feed_watchdog()
