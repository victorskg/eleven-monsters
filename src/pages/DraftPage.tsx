import { memo } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { PitchField, getNextEmptySlot } from "../components/draft/PitchField";
import { PackOpening } from "../components/draft/PackOpening";
import { Button } from "../components/ui/Button";
import { ScreenLayout } from "../components/ui/ScreenLayout";
import { useGameStore } from "../stores/gameStore";

export const DraftPage = memo(function DraftPage() {
  const draftSlots = useGameStore((s) => s.draftSlots);
  const formationId = useGameStore((s) => s.formationId);
  const currentPack = useGameStore((s) => s.currentPack);
  const mode = useGameStore((s) => s.mode);
  const rerollsLeft = useGameStore((s) => s.rerollsLeft);
  const scoutLeft = useGameStore((s) => s.scoutLeft);
  const scoutedPlayerId = useGameStore((s) => s.scoutedPlayerId);
  const packAnimating = useGameStore((s) => s.packAnimating);
  const openPack = useGameStore((s) => s.openPack);
  const rerollPack = useGameStore((s) => s.rerollPack);
  const scoutPlayer = useGameStore((s) => s.scoutPlayer);
  const selectPlayer = useGameStore((s) => s.selectPlayer);
  const setPackAnimating = useGameStore((s) => s.setPackAnimating);

  const nextSlot = getNextEmptySlot(draftSlots);
  const filled = draftSlots.filter((s) => s.player).length;
  const showOverlay = Boolean(currentPack);

  const overlay = showOverlay
    ? createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 backdrop-blur-md p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Escolha um jogador"
        >
          <div className="my-auto flex w-full max-w-4xl flex-col items-center gap-4 py-4">
            <PackOpening
              pack={currentPack!}
              mode={mode}
              scoutedPlayerId={scoutedPlayerId}
              onSelect={selectPlayer}
              onScout={scoutPlayer}
              onAnimationComplete={() => setPackAnimating(false)}
              scoutLeft={scoutLeft}
              overlay
            />
            {!packAnimating && (
              <Button
                variant="secondary"
                size="sm"
                onClick={rerollPack}
                disabled={rerollsLeft <= 0}
              >
                Reroll ({rerollsLeft})
              </Button>
            )}
          </div>
        </motion.div>,
        document.body,
      )
    : null;

  return (
    <ScreenLayout
      title="DRAFT"
      subtitle={`${filled}/11 jogadores`}
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
        <div
          className={`w-full transition-all duration-300 ${
            showOverlay ? "scale-[0.98] opacity-30" : ""
          }`}
        >
          <PitchField
            slots={draftSlots}
            formationId={formationId}
            currentSlotId={nextSlot?.slotId}
            mode={mode}
            size="large"
          />
        </div>

        {overlay}

        {!showOverlay && (
          <div className="mt-6 flex flex-col items-center gap-3">
            {nextSlot ? (
              <>
                <p className="font-display text-lg tracking-widest text-[var(--color-gold)]">
                  Próxima posição: {nextSlot.label}
                </p>
                <Button size="lg" onClick={openPack}>
                  Abrir Pacote
                </Button>
              </>
            ) : (
              <p className="font-display text-xl text-[var(--color-gold)]">
                Escalação completa!
              </p>
            )}
          </div>
        )}
      </div>
    </ScreenLayout>
  );
});

export default DraftPage;
