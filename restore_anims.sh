sed -i 's/animate={{/animate={{\n          y: [0, -20, 0],\n          rotate: [0, 5, -5, 0],/g' src/app/components/screens/StartScreen.tsx
sed -i 's/animate={{/animate={{\n              y: [0, -10, 0],/g' src/app/components/screens/PlanetScreen.tsx
sed -i 's/animate={{/animate={{\n          y: [0, -100, 0],\n          rotate: [0, 360],/g' src/app/components/screens/TravelScreen.tsx
