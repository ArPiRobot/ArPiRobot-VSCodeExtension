package robot.actions;

import robot.Main;
import arpirobot.core.log.Logger;
import arpirobot.core.action.Action;

// Actions can access the current robot instance using Main.robot

/*public class ExampleAction extends Action {

    // You can define a custom constructor here (with arguments) if needed

    // Run when the action is started. 
    // If an action needs exclusive control of devices, lock them here
    @Override
    protected void begin() {

    }

    // Run periodically while the action is running
    @Override
    protected void process() {

    }

    // Run when the action is stopped
    // wasInterrupted will be true if the action did not stop on its own (see shouldContinue)
    @Override
    protected void finish(boolean wasInterrupted) {

    }

    // The action will stop itself when this returns false
    // This is run after each time process() runs to determine if the action should stop
    @Override
    protected boolean shouldContinue() {
        return false;
    }
    
}*/