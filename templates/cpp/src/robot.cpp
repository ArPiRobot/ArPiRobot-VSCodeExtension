#include <robot.hpp>
#include <actions.hpp>

#include <arpirobot/core/log.hpp>
#include <arpirobot/core/action.hpp>
#include <arpirobot/core/network.hpp>

using namespace arpirobot;


void Robot::robotStarted(){
    // Configure devices here
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