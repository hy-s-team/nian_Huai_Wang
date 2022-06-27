const glsl = require('glslify');

export const LokiMatShader = {
    vertexShader: glsl`
        uniform mat4 modelMatrix;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        
        uniform vec3 cameraPosition;
        
        attribute vec2 uv;
        attribute vec3 position;
        attribute vec3 normal;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPos;
        varying vec3 vViewDirection;
        
        void main() {
            vUv = uv;
            vec3 transformed = position;
            vec4 worldPos  = modelViewMatrix * vec4(transformed, 1.0);
            vNormal = normalize(modelViewMatrix * vec4(normal, 0.0)).xyz;
            vViewDirection = -worldPos.xyz;
        
            vPos = vec4(transformed, 1.0).xyz;
        
            gl_Position = projectionMatrix * worldPos;
        }
    `,

    fragmentShader: glsl`
        precision highp float;
        #define OCTAVES 10
        #define PI 3.14159265359
        #define S smoothstep
        #define saturate(t) clamp(t, 0., 1.)
        
        #pragma glslify: noise3D = require('glsl-noise/simplex/3d')
        #pragma glslify: noise4D = require('glsl-noise/simplex/4d')
        
        uniform float progress;
        uniform float time;
        uniform float baseNoiseIteration;
        uniform float noiseDiffusion;
        uniform float noisePrecision;
        uniform float lightningDiffusion;
        uniform float lightningThickness;
        uniform float lightningPower;
        uniform vec3 size;
        uniform vec2 vanishDirection;
        uniform vec3 lightColor;
        
        uniform vec3 color;
        uniform sampler2D map;
        uniform vec3 emissive;
        uniform sampler2D emissiveMap;
        uniform float alphaTest;
        
        varying vec3 vNormal;
        varying vec3 vViewDirection;
        varying vec2 vUv;
        varying vec3 vPos;
        
        float noise4D(vec4 n);
        float noise3D(vec3 n);
        
        vec2 rotate(vec2 v, float a) {
            float s = sin(a);
            float c = cos(a);
            mat2 m = mat2(c, -s, s, c);
            return m * v;
        }
        
        float fbm(vec4 pos, float maxIteration) {
            float iterations = 0.0;
            float amplitude = 1.0;
            float period = 1.0;
        
            for (int i = 0; i < OCTAVES; i++) {
                if (float(i) > maxIteration) break;
                period *= noisePrecision;
                amplitude *= 0.9;
                iterations += noise4D(vec4(pos.xyz * period, pos.w)) * amplitude;
            }
        
            return (iterations / maxIteration) * 0.5 + 0.5;
        }
        
        void main() {
            vec3 normal = vNormal;
            vec3 viewDir = normalize(vViewDirection);
        
            // Color & Map
            vec4 diffuseColor = texture2D(map, vUv);
            diffuseColor.rgb *= color;
        
            // Emissive & EmissiveMap
            vec3 totalEmissiveRadiance = emissive;
            vec4 emissiveColor = texture2D(emissiveMap, vUv);
            totalEmissiveRadiance *= emissiveColor.rgb;
        
            // AlphaTest
            if (diffuseColor.a < alphaTest) discard;
        
            vec3 outgoingColor = diffuseColor.rgb + totalEmissiveRadiance;
        
            vec3 pos = vPos;
            float pX =  1.0 - pos.y / size.y;
            float nD = pow(noiseDiffusion, 3.0);
            float p = S(pX, pX + nD, (progress) * (1.0 + nD));
        
            float noise = fbm(vec4(pos, time * 0.1 + progress), baseNoiseIteration);
            float pNoise = noise3D(vec3(vUv * noise, p * noise)) * 0.5 + 0.5;
            float progressNoise = S(0.0, 0.3, p - pNoise);
            float maskProgress = S(0.0, lightningDiffusion, progressNoise);
            vec4 finalColor = mix(vec4(outgoingColor, diffuseColor.a), vec4(0.0), maskProgress);
        
            float dir = dot(normal, viewDir);
            float att = 1.0;
            if (dir <= 0.0) {
                finalColor.rgb *= 0.9;
                att = 0.5;
            }
            vec4 light = vec4(lightColor, 1.0);
            finalColor = mix(finalColor, light, maskProgress - S(0.0, lightningThickness * att, progressNoise));
            finalColor = mix(finalColor, vec4(color, 1.0), maskProgress - S(0.0, lightningPower * att, progressNoise));
            if (finalColor.a <= 0.0) discard;
        
            gl_FragColor = finalColor;
        }
    `,
};
