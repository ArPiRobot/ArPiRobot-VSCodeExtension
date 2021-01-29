package robot;

import arpirobot.core.robot.BaseRobot;
import arpirobot.core.log.Logger;

public class Robot extends BaseRobot {

    // Add devices and constants here as member objects
    // These should be public so actions can access them using Main.robot

    // Run when the robot starts
    @Override
    protected void robotStarted() {
        
    }

    // Runs once each time the robot becomes enabled
    @Override
    protected void robotEnabled() {
        
    }

    // Runs once each time the robot becomes disabled
    @Override
    protected void robotDisabled() {
        
    }

    // Runs periodically while the robot is enabled
    @Override
    protected void enabledPeriodic() {
        
    }

    // Runs periodically while the robot is disabled
    @Override
    protected void disabledPeriodic() {
        
    }

    // Runs periodically (regardless of robot state)
    @Override
    protected void periodic() {
        feedWatchdog();
    }
    
}
