#!/bin/bash

docker cp dist-amd/lib.min.js 7a54c0fdb50a8bce4cad37f199f562330efc4c56ba560dda7aacc338aaa5abce:/bitnami/moodle/local/mokitul/amd/build/lib.min.js
docker cp dist-amd/lib.min.js.map 7a54c0fdb50a8bce4cad37f199f562330efc4c56ba560dda7aacc338aaa5abce:/bitnami/moodle/local/mokitul/amd/build/lib.min.j.map
