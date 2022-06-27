
export const FresnelShader = {

    uniforms: {
        time: { value: 0 },
        bias: { value: 0 },
        scale: { value: 1 },
        power: { value: 3 }
    },

    vertexParas: /* glsl */`
        uniform float time;
        varying vec3 vWorldPosition;
        varying vec3 vWorldNormal;
    `,

    vertexShader1: /* glsl */`
        vec3 transformed = vec3(position);
        vec3 wobbleValue = (6.0 * transformed) + time;
        vec3 wobblePos =  vec3(cos(wobbleValue.x) * 0.15 + sin(wobbleValue.x) * 0.05, cos(wobbleValue.y) * 0.15 + sin(wobbleValue.y) * 0.05, cos(wobbleValue.z) * 0.15 + sin(wobbleValue.z) * 0.05);
        transformed += wobblePos;
    `,

    /**
     * position是内置变量，代表顶点在对象空间的坐标
     */
    vertexShader2: /* glsl */`
        vWorldPosition = worldPosition.xyz;
        vWorldNormal = normalize(vec3(modelMatrix * vec4(normal, 0.0)));
    `,

    fragmentParas: /* glsl */`
        #include <transmission_pars_fragment>
        varying vec3 vWorldNormal;
        uniform float fresnelBias;
        uniform float fresnelScale;
        uniform float fresnelPower;
    `,

    /**
     * viewMatrix是内置变量，代表相机的视图矩阵(camera.matrixWorldInverse)
     * cameraPosition是内置变量，代表相机在世界空间的坐标(camera position in world space)
     */
    fragmentShaderEmissive: /* glsl */`
        vec3 viewDir = normalize(cameraPosition - vWorldPosition);
        float fresnelNdot = dot(viewDir, vWorldNormal);
        float fresnelValue = fresnelBias + fresnelScale * pow(1.0 - fresnelNdot, fresnelPower);
        // fresnelValue = [0, 1]， 0=center，1=edge
        
        vec3 totalEmissiveRadiance = emissive * fresnelValue;
    `,
};
