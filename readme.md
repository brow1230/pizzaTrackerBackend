# Pizza Tracking thing.

## We need a name, this really isn't a good one.

# *Changes*

A11:
    Made schemas models for everything... Still need to add the functions in them though.
    Built the Auth router, all commented lines are because the other files aren't there yet.

A17:
    Did more router stuff, made the startup file... added some debug statements, test on postman and it's sorta working so far for auth...

A24:

    Password changing sortof works, just saves an unhashed password and dosen't let you log in ever again. Must fix...

A25: 

    Password changing now functional, chaged to use model.save() instead of model.findByIdAndUpdate()

A27: 

    Got it connecting to Robert's Database.. Still not getting any responses from it 


September 2021: 
    Fixed Saltrounds - password encryption on signup now works as expected
    Removed `Parse Token` in favour of specifically pulling `bearer token` 