const FresnelShader={uniforms:{time:{value:0},bias:{value:0},scale:{value:1},power:{value:3}},vertexParas:`
        uniform float time;
        varying vec3 vWorldPosition;
        varying vec3 vWorldNormal;
    `,vertexShader1:`
        vec3 transformed = vec3(position);
        vec3 wobbleValue = (6.0 * transformed) + time;
        vec3 wobblePos =  vec3(cos(wobbleValue.x) * 0.6 + sin(wobbleValue.x) * 0.2, cos(wobbleValue.y) * 0.6 + sin(wobbleValue.y) * 0.2, cos(wobbleValue.z) * 0.6 + sin(wobbleValue.z) * 0.2);
        transformed += wobblePos;
    `,vertexShader2:`
        vWorldPosition = worldPosition.xyz;
        vWorldNormal = normalize(vec3(modelMatrix * vec4(normal, 0.0)));
    `,fragmentParas:`
        #include <transmission_pars_fragment>
        varying vec3 vWorldNormal;
        uniform float fresnelBias;
        uniform float fresnelScale;
        uniform float fresnelPower;
    `,fragmentShaderEmissive:`
        vec3 viewDir = normalize(cameraPosition - vWorldPosition);
        float fresnelNdot = dot(viewDir, vWorldNormal);
        float fresnelValue = fresnelBias + fresnelScale * pow(1.0 - fresnelNdot, fresnelPower);
        // fresnelValue = [0, 1]， 0=center，1=edge
        
        vec3 totalEmissiveRadiance = emissive * fresnelValue;
    `};export{FresnelShader};