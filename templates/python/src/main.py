# If running under debugger, pause at entry
try:
    import sys
    has_trace = hasattr(sys, 'gettrace') and sys.gettrace() is not None
    has_breakpoint = sys.breakpointhook.__module__ != "sys"
    is_debug = has_trace or has_breakpoint
    if is_debug:
        # Running under debugger
        import debugpy
        debugpy.breakpoint()
except:
    # debugpy probably not installed
    pass

robot: 'robot_mod.Robot' = None

import robot as robot_mod

if __name__ == "__main__":
    import main # No this is not redundant!
    main.robot = robot_mod.Robot()
    main.robot.start()