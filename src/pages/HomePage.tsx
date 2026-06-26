import { memo } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { ScreenLayout } from "../components/ui/ScreenLayout";
import { useGameStore } from "../stores/gameStore";

export const HomePage = memo(function HomePage() {
  const setScreen = useGameStore((s) => s.setScreen);

  return (
    <ScreenLayout>
      <div className="flex flex-1 flex-col items-center justify-center gap-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="font-display text-sm tracking-[0.4em] text-[var(--color-cream)]/60 mb-2">
            COPA DOS SONHOS
          </p>
          <h1 className="font-display text-7xl sm:text-8xl tracking-[0.1em] text-[var(--color-gold)] drop-shadow-lg">
            ELEVEN
            <br />
            MONSTERS
          </h1>
          <p className="mt-4 max-w-md mx-auto text-sm italic text-[var(--color-cream)]/80">
            Monte sua seleção com lendas das Copas do Mundo.
            Abra pacotes. Domine a tática. Conquiste a taça.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button size="lg" onClick={() => setScreen("setup")}>
            Jogar Agora
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-3 gap-6 text-center max-w-lg"
        >
          {[
            { n: "32", l: "Seleções" },
            { n: "350+", l: "Jogadores" },
            { n: "7", l: "Partidas" },
          ].map((stat) => (
            <div key={stat.l}>
              <p className="font-display text-3xl text-[var(--color-gold)]">
                {stat.n}
              </p>
              <p className="text-xs uppercase tracking-widest opacity-60">
                {stat.l}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </ScreenLayout>
  );
});

export default HomePage;
