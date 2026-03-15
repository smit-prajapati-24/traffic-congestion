import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Plane, Box, RoundedBox, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Constants
const ROAD_WIDTH = 10;
const LANE_WIDTH = 2.4;
const VEHICLE_SPEED = 0.18;
const SPAWN_INTERVAL = 1200;

// Vehicle Component
const Vehicle = ({ id, type, startPos, direction, lightState, onComplete, vehiclePositions, cycle }) => {
  const meshRef = useRef();
  const [speed, setSpeed] = useState(VEHICLE_SPEED);

  const color = useMemo(() => {
    if (type === 'taxi') return '#facc15';
    if (type === 'bus') return '#10b981';
    if (type === 'truck') return '#ef4444';
    if (type === 'van') return '#64748b';
    return type === 'car' ? '#3b82f6' : '#ffffff';
  }, [type]);

  const rotationObj = useMemo(() => {
    if (direction === 'north') return [0, Math.PI, 0];
    if (direction === 'south') return [0, 0, 0];
    if (direction === 'east') return [0, Math.PI / 2, 0];
    if (direction === 'west') return [0, -Math.PI / 2, 0];
    return [0, 0, 0];
  }, [direction]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const currentPos = meshRef.current.position;
    vehiclePositions.current[id] = { position: currentPos, direction };
    let shouldStop = false;
    const isNearIntersection = direction === 'north' ? currentPos.z > 8 && currentPos.z < 16 :
      direction === 'south' ? currentPos.z < -8 && currentPos.z > -16 :
        direction === 'east' ? currentPos.x < -8 && currentPos.x > -16 :
          direction === 'west' ? currentPos.x > 8 && currentPos.x < 16 : false;

    if (isNearIntersection && lightState === 'red') shouldStop = true;

    Object.values(vehiclePositions.current).forEach(other => {
      if (other.position !== currentPos && other.direction === direction) {
        if (direction === 'north' && other.position.z < currentPos.z && other.position.z > currentPos.z - 5.5) shouldStop = true;
        if (direction === 'south' && other.position.z > currentPos.z && other.position.z < currentPos.z + 5.5) shouldStop = true;
        if (direction === 'east' && other.position.x > currentPos.x && other.position.x < currentPos.x + 5.5) shouldStop = true;
        if (direction === 'west' && other.position.x < currentPos.x && other.position.x > currentPos.x - 5.5) shouldStop = true;
      }
    });

    if (shouldStop) {
      setSpeed(Math.max(0, speed - 0.015));
    } else {
      setSpeed(Math.min(VEHICLE_SPEED, speed + 0.005));
    }

    if (direction === 'north') meshRef.current.position.z -= speed;
    if (direction === 'south') meshRef.current.position.z += speed;
    if (direction === 'east') meshRef.current.position.x += speed;
    if (direction === 'west') meshRef.current.position.x -= speed;

    if (Math.abs(meshRef.current.position.x) > 55 || Math.abs(meshRef.current.position.z) > 55) {
      delete vehiclePositions.current[id];
      onComplete();
    }
  });

  const lightIntensity = cycle > 0.6 ? 4 : 0; // Only glow at night

  const renderWheels = (x, zBase, count) => (
    <group position={[0, -0.2, 0]}>
      {Array.from({length: count}).map((_, i) => {
        const z = zBase - (i * (zBase * 2 / (count - 1 || 1)));
        return (
          <React.Fragment key={i}>
            <mesh position={[-x, 0, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.3, 0.3, 0.3, 16]} />
              <meshStandardMaterial color="#111111" roughness={0.9} />
            </mesh>
            <mesh position={[x, 0, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.3, 0.3, 0.3, 16]} />
              <meshStandardMaterial color="#111111" roughness={0.9} />
            </mesh>
          </React.Fragment>
        );
      })}
    </group>
  );

  return (
    <group ref={meshRef} position={startPos} rotation={rotationObj}>
      {type === 'ambulance' && (
        <group>
          {renderWheels(0.7, 1.0, 2)}
          <group position={[0, 0.4, 0]}>
            <RoundedBox args={[1.4, 1.2, 2.8]} radius={0.1} smoothness={4}>
              <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.3} />
            </RoundedBox>
            <mesh position={[0, 0.3, 1.2]} rotation={[-0.1, 0, 0]}>
              <planeGeometry args={[1.2, 0.5]} />
              <meshStandardMaterial color="#000000" emissive="#0ea5e9" emissiveIntensity={0.1} transparent opacity={0.6} />
            </mesh>
            <Box args={[0.8, 0.2, 0.4]} position={[0, 0.7, 0.5]}>
              <meshStandardMaterial color="#333333" />
            </Box>
            <mesh position={[0.2, 0.7, 0.6]}>
              <boxGeometry args={[0.3, 0.2, 0.2]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={cycle > 0.5 ? 4 : 0} />
            </mesh>
            <mesh position={[-0.2, 0.7, 0.6]}>
              <boxGeometry args={[0.3, 0.2, 0.2]} />
              <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={cycle > 0.5 ? 4 : 0} />
            </mesh>
          </group>
        </group>
      )}
      {type === 'bus' && (
        <group>
          {renderWheels(0.7, 1.8, 2)}
          <group position={[0, 0.6, 0]}>
            <RoundedBox args={[1.4, 1.4, 4.2]} radius={0.1} smoothness={4}>
              <meshStandardMaterial color={color} metalness={0.1} roughness={0.3} />
            </RoundedBox>
            <mesh position={[0, 0.2, 2.11]}>
              <planeGeometry args={[1.2, 0.8]} />
              <meshStandardMaterial color="#000000" transparent opacity={0.7} />
            </mesh>
            <mesh position={[0.71, 0.2, 0]} rotation={[0, Math.PI/2, 0]}>
              <planeGeometry args={[3.8, 0.6]} />
              <meshStandardMaterial color="#000000" transparent opacity={0.7} />
            </mesh>
            <mesh position={[-0.71, 0.2, 0]} rotation={[0, -Math.PI/2, 0]}>
              <planeGeometry args={[3.8, 0.6]} />
              <meshStandardMaterial color="#000000" transparent opacity={0.7} />
            </mesh>
          </group>
        </group>
      )}
      {type === 'truck' && (
        <group>
          {renderWheels(0.7, 1.6, 3)}
          <group position={[0, 0.2, 0]}>
            <RoundedBox args={[1.4, 1.2, 1.2]} radius={0.1} position={[0, 0.4, 1.2]} smoothness={4}>
              <meshStandardMaterial color={color} metalness={0.5} />
            </RoundedBox>
            <Box args={[1.4, 1.8, 2.8]} position={[0, 0.7, -0.9]}>
              <meshStandardMaterial color="#f8fafc" roughness={0.8} />
            </Box>
          </group>
        </group>
      )}
      {type === 'van' && (
        <group>
          {renderWheels(0.6, 1.0, 2)}
          <group position={[0, 0.5, 0]}>
            <RoundedBox args={[1.2, 1.0, 2.6]} radius={0.1} smoothness={4}>
              <meshStandardMaterial color={color} metalness={0.2} roughness={0.4} />
            </RoundedBox>
            <mesh position={[0, 0.2, 1.31]} rotation={[-0.1, 0, 0]}>
              <planeGeometry args={[1.0, 0.5]} />
              <meshStandardMaterial color="#000000" transparent opacity={0.7} />
            </mesh>
          </group>
        </group>
      )}
      {['car', 'taxi'].includes(type) && (
        <group>
          {renderWheels(0.6, 0.7, 2)}
          <group position={[0, 0.2, 0]}>
            <RoundedBox args={[1.3, 0.7, 2.5]} radius={0.1} smoothness={4}>
              <meshStandardMaterial color={color} metalness={0.7} roughness={0.1} />
            </RoundedBox>
            <RoundedBox args={[1.1, 0.6, 1.3]} radius={0.1} smoothness={4} position={[0, 0.5, -0.2]}>
              <meshStandardMaterial color={color} metalness={0.7} roughness={0.1} />
            </RoundedBox>
            <mesh position={[0, 0.5, 0.46]} rotation={[-0.2, 0, 0]}>
              <planeGeometry args={[0.9, 0.45]} />
              <meshStandardMaterial color="#000000" emissive="#0ea5e9" emissiveIntensity={0.1} transparent opacity={0.6} />
            </mesh>
            <mesh position={[0, 0.5, -0.86]} rotation={[0.2, Math.PI, 0]}>
              <planeGeometry args={[0.9, 0.45]} />
              <meshStandardMaterial color="#000000" transparent opacity={0.6} />
            </mesh>
          </group>
        </group>
      )}

      {/* Headlights and Taillights */}
      <mesh position={[0.45, 0.4, type === 'bus' ? 2.1 : type === 'truck' ? 1.8 : 1.3]}>
        <boxGeometry args={[0.2, 0.2, 0.1]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={lightIntensity} />
      </mesh>
      <mesh position={[-0.45, 0.4, type === 'bus' ? 2.1 : type === 'truck' ? 1.8 : 1.3]}>
        <boxGeometry args={[0.2, 0.2, 0.1]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={lightIntensity} />
      </mesh>
      <mesh position={[0.35, 0.4, type === 'bus' ? -2.1 : type === 'truck' ? -2.3 : -1.3]}>
        <boxGeometry args={[0.3, 0.1, 0.05]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={cycle > 0.7 ? 2 : 0} />
      </mesh>
      <mesh position={[-0.35, 0.4, type === 'bus' ? -2.1 : type === 'truck' ? -2.3 : -1.3]}>
        <boxGeometry args={[0.3, 0.1, 0.05]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={cycle > 0.7 ? 2 : 0} />
      </mesh>
    </group>
  );
};

// Traffic Light Component
const TrafficLight = ({ position, rotation, state }) => {
  return (
    <group position={position} rotation={rotation}>
      <Box args={[0.5, 4, 0.5]} position={[0, 2, 0]}>
        <meshStandardMaterial color="#1f2937" />
      </Box>
      <Box args={[1.5, 3.5, 1.2]} position={[0, 4.5, 0.2]}>
        <meshStandardMaterial color="#000000" />

        {/* Red Light */}
        <mesh position={[0, 0.8, 0.61]}>
          <circleGeometry args={[0.5, 32]} />
          <meshStandardMaterial color={state === 'red' ? '#ff2222' : '#330000'} emissive={state === 'red' ? '#ff2222' : '#000'} emissiveIntensity={5} />
        </mesh>

        {/* Green Light */}
        <mesh position={[0, -0.8, 0.61]}>
          <circleGeometry args={[0.5, 32]} />
          <meshStandardMaterial color={state === 'green' ? '#22ff22' : '#003300'} emissive={state === 'green' ? '#22ff22' : '#000'} emissiveIntensity={5} />
        </mesh>
      </Box>
    </group>
  );
};

// Street Light Component
const StreetLight = ({ position, rotation, cycle }) => {
  const lightIntensity = Math.max(0, THREE.MathUtils.lerp(0, 5, (cycle - 0.4) * 2)); // Start glowing after 0.4 cycle
  return (
    <group position={position} rotation={rotation}>
      <Box args={[0.4, 12, 0.4]} position={[0, 6, 0]}>
        <meshStandardMaterial color="#334155" />
      </Box>
      <Box args={[2, 0.4, 0.4]} position={[0.8, 11.8, 0]}>
        <meshStandardMaterial color="#334155" />
      </Box>
      <Box args={[1.2, 0.6, 1]} position={[1.8, 11.5, 0]}>
        <meshStandardMaterial color="#1e293b" />
        <mesh position={[0, -0.31, 0]}>
          <planeGeometry args={[1, 0.8]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={lightIntensity} />
        </mesh>
      </Box>
      {lightIntensity > 0 && (
        <spotLight 
          position={[1.8, 11, 0]} 
          target-position={[1.8, 0, 0]}
          angle={Math.PI / 3} 
          penumbra={0.6} 
          intensity={lightIntensity * 20} 
          distance={35} 
          color="#fef08a" 
          castShadow 
        />
      )}
      <pointLight position={[1.8, 11, 0]} intensity={lightIntensity * 0.5} distance={15} color="#fef08a" />
    </group>
  );
};

const Simulation = ({ buildings, vehicles, removeVehicle, lightStateNS, lightStateEW, vehiclePositions }) => {
  const [cycle, setCycle] = useState(0); // 0 = Mid-day, 1 = Deep-night
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    timeRef.current += delta * 0.05;
    const c = (Math.sin(timeRef.current) + 1) / 2;
    if (Math.abs(c - cycle) > 0.01) setCycle(c);
  });

  const ambientIntensity = THREE.MathUtils.lerp(1.5, 0.2, cycle);
  const directionalIntensity = THREE.MathUtils.lerp(2.5, 0.5, cycle);
  const skyColor = new THREE.Color('#94a3b8').lerp(new THREE.Color('#020617'), cycle).getStyle();
  const roadColor = new THREE.Color('#64748b').lerp(new THREE.Color('#111111'), cycle).getStyle();
  const buildingColor = new THREE.Color('#e2e8f0').lerp(new THREE.Color('#1e293b'), cycle).getStyle();
  const groundColor = new THREE.Color('#cbd5e1').lerp(new THREE.Color('#0f172a'), cycle).getStyle();

  return (
    <>
      <PerspectiveCamera makeDefault position={[25, 30, 25]} fov={35} />
      <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2.5} minPolarAngle={Math.PI / 4} />

      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={[THREE.MathUtils.lerp(20, -20, cycle), 40, 10]}
        intensity={directionalIntensity}
        castShadow
      />
      <Environment preset={cycle > 0.5 ? 'night' : 'apartment'} />
      <color attach="background" args={[skyColor]} />

      <group>
        <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <meshStandardMaterial color={groundColor} />
        </Plane>
        <Plane args={[ROAD_WIDTH, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <meshStandardMaterial color={roadColor} />
        </Plane>
        <Plane args={[100, ROAD_WIDTH]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <meshStandardMaterial color={roadColor} />
        </Plane>
        <Plane args={[ROAD_WIDTH, ROAD_WIDTH]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <meshStandardMaterial color={roadColor} />
        </Plane>

        {[...Array(20)].map((_, i) => (
          <React.Fragment key={`v-mark-${i}`}>
            <Plane args={[0.2, 2]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, -45 + i * 5]}>
              <meshStandardMaterial color="white" transparent opacity={0.8} />
            </Plane>
          </React.Fragment>
        ))}
        {[...Array(20)].map((_, i) => (
          <React.Fragment key={`h-mark-${i}`}>
            <Plane args={[2, 0.2]} rotation={[-Math.PI / 2, 0, 0]} position={[-45 + i * 5, 0.03, 0]}>
              <meshStandardMaterial color="white" transparent opacity={0.8} />
            </Plane>
          </React.Fragment>
        ))}
      </group>

      {buildings.map(b => (
        <Box key={b.id} args={[b.width, b.height, b.depth]} position={[b.x, b.height / 2, b.z]}>
          <meshStandardMaterial color={buildingColor} metalness={0.2} roughness={0.5} />
        </Box>
      ))}

      <TrafficLight position={[6, 0, 6]} rotation={[0, -Math.PI / 4, 0]} state={lightStateNS} />
      <TrafficLight position={[-6, 0, -6]} rotation={[0, 3 * Math.PI / 4, 0]} state={lightStateNS} />
      <TrafficLight position={[6, 0, -6]} rotation={[0, -3 * Math.PI / 4, 0]} state={lightStateEW} />
      <TrafficLight position={[-6, 0, 6]} rotation={[0, Math.PI / 4, 0]} state={lightStateEW} />

      {/* Street Lights */}
      <StreetLight position={[8, 0, 8]} rotation={[0, -Math.PI / 4, 0]} cycle={cycle} />
      <StreetLight position={[-8, 0, -8]} rotation={[0, 3 * Math.PI / 4, 0]} cycle={cycle} />
      <StreetLight position={[8, 0, -8]} rotation={[0, -3 * Math.PI / 4, 0]} cycle={cycle} />
      <StreetLight position={[-8, 0, 8]} rotation={[0, Math.PI / 4, 0]} cycle={cycle} />

      {vehicles.map(v => (
        <Vehicle
          key={v.id}
          {...v}
          vehiclePositions={vehiclePositions}
          lightState={['north', 'south'].includes(v.direction) ? lightStateNS : lightStateEW}
          onComplete={() => removeVehicle(v.id)}
          cycle={cycle}
        />
      ))}
    </>
  );
};

const CrossroadsBackground = () => {
  const [lightStateNS, setLightStateNS] = useState('green');
  const [vehicles, setVehicles] = useState([]);
  const vehicleIdRef = useRef(0);
  const vehiclePositions = useRef({});

  const buildings = useMemo(() => {
    const arr = [];
    const coords = [-40, -32, -24, -16, 16, 24, 32, 40];
    coords.forEach(x => {
      coords.forEach(z => {
        if (x === 16 && z === 16) return; // Remove building blocking the view
        if (Math.random() > 0.8) return;
        const width = 4 + Math.random() * 4;
        const depth = 4 + Math.random() * 4;
        const height = Math.random() > 0.8 ? 15 + Math.random() * 25 : 5 + Math.random() * 15;
        arr.push({ id: `${x}-${z}`, x, z, width, height, depth });
      });
    });
    return arr;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const nsCount = vehicles.filter(v => ['north', 'south'].includes(v.direction)).length;
      const ewCount = vehicles.filter(v => ['east', 'west'].includes(v.direction)).length;
      setLightStateNS(prev => {
        if (prev === 'green' && ewCount > nsCount + 2) return 'red';
        if (prev === 'red' && nsCount > ewCount + 2) return 'green';
        return prev;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [vehicles]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLightStateNS(prev => prev === 'green' ? 'red' : 'green');
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const lightStateEW = lightStateNS === 'green' ? 'red' : 'green';

  useEffect(() => {
    const spawnInterval = setInterval(() => {
      const directions = ['north', 'south', 'east', 'west'];
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const types = ['car', 'car', 'taxi', 'taxi', 'ambulance', 'bus', 'truck', 'van'];
      const type = types[Math.floor(Math.random() * types.length)];
      let startPos;
      if (dir === 'north') startPos = [LANE_WIDTH / 2, 0.4, 45];
      if (dir === 'south') startPos = [-LANE_WIDTH / 2, 0.4, -45];
      if (dir === 'east') startPos = [-45, 0.4, LANE_WIDTH / 2];
      if (dir === 'west') startPos = [45, 0.4, -LANE_WIDTH / 2];
      const id = vehicleIdRef.current++;
      setVehicles(prev => [...prev, { id, type, startPos, direction: dir }]);
    }, SPAWN_INTERVAL);
    return () => clearInterval(spawnInterval);
  }, []);

  const removeVehicle = (id) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  return (
    <Canvas shadows dpr={[1, 2]}>
      <Simulation
        buildings={buildings}
        vehicles={vehicles}
        removeVehicle={removeVehicle}
        lightStateNS={lightStateNS}
        lightStateEW={lightStateEW}
        vehiclePositions={vehiclePositions}
      />
    </Canvas>
  );
};

export default CrossroadsBackground;
