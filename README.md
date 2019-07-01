# altmp-js-prop-spawner

## Description

This adds client-side utilities to help you spawn gtav props on alt:v.
(Loads 3D Prop model asyncronomously)

RoadMap:
* Add container utilities. (foreach, get(id), and more...)
* Add some getters & setters. (Position, rotation)
* Add client-side streamer support. (Should be optional)

## Instalation

1. Clone the repository.
2. Install as regular alt:v resource.

## Static Prop Example (Physics disabled)

```
import ALTProp from "altmp-js-prop-spawner";

let prop = ALTProp.new(
    "prop_pineapple",
    {
        x: 0,
        y: 0,
        z: 80
    },
    {
        dynamic: false
    }
);

setTimeout(
    () => {
        prop.destroy();
    },
    5000
);
```

## Dynamic Prop Example (Physics enabled)

```
import ALTProp from "altmp-js-prop-spawner";

let prop = ALTProp.new(
    "prop_pineapple",
    {
        x: 0,
        y: 0,
        z: 80
    },
    {
        dynamic: true
    }
);

setTimeout(
    () => {
        prop.destroy();
    },
    5000
);
```

