#pragma once

#include <arpirobot/core/robot/BaseRobot.hpp>

#include <actions.hpp>

// Other includes (for devices and other objects) here


using namespace arpirobot;


class Robot : public BaseRobot{
public:
    
    // Run when the robot starts
    void robotStarted();

    // Runs once each time the robot becomes enabled
    void robotEnabled();

    // Runs once each time the robot becomes disabled
    void robotDisabled();

    // Runs periodically while the robot is enabled
    void enabledPeriodic();

    // Runs periodically while the robot is disabled
    void disabledPeriodic();

    // Runs periodically (regardless of robot state)
    void periodic();


    // Add devices and constants here as member objects
    // These should be public so actions can access them using Main::robot
};