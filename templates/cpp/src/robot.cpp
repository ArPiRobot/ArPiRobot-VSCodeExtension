#include <robot.hpp>

#include <arpirobot/log/Logger.hpp>
#include <arpirobot/action/ActionManager.hpp>
#include <arpirobot/network/NetworkTable.hpp>

using namespace arpirobot;


void Robot::robotStarted(){
    // Configure devices here
}

void Robot::robotStopped(){

}

void Robot::robotEnabled(){

}

void Robot::robotDisabled(){

}

void Robot::enabledPeriodic(){

}

void Robot::disabledPeriodic(){

}

void Robot::periodic(){
    // Do not remove this line or some devices will be disabled.
    feedWatchdog();
}