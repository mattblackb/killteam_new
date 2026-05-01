import { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_ARMY_ID, KILL_TEAM_ARMIES } from "./data/killTeams";
import { loadAppState, saveBattleState, saveDraftRoster, saveSavedArmies, saveDashboardLayout, saveBattleDashboardLayout } from "./lib/storage";
import { clamp, createId, toDataUrl } from "./utils/helpers";
import { hydrateMembers } from "./utils/operativeUtils";
import { createBattleArmy, normalizeBattleState } from "./utils/battleUtils";
import BuilderPage from "./pages/BuilderPage";
import OverviewPage from "./pages/OverviewPage";
import BattlePage from "./pages/BattlePage";
import DashboardPage from "./pages/DashboardPage";
import BattleDashboardPage from "./pages/BattleDashboardPage";

export default function App() {
  const [screen, setScreen] = useState("builder");
  const [armyId, setArmyId] = useState(DEFAULT_ARMY_ID);
  const [armyName, setArmyName] = useState("");
  const [armyNotes, setArmyNotes] = useState("");
  const [memberNotes, setMemberNotes] = useState("");
  const [memberName, setMemberName] = useState("");
  const [cardFile, setCardFile] = useState(null);
  const [cardFile2, setCardFile2] = useState(null);
  const [members, setMembers] = useState([]);
  const [savedArmies, setSavedArmies] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveArmyMessage, setSaveArmyMessage] = useState("");
  const [isLoadingState, setIsLoadingState] = useState(true);
  const [storageError, setStorageError] = useState("");
  const [selectedOverviewArmyIds, setSelectedOverviewArmyIds] = useState([]);
  const [battleState, setBattleState] = useState(null);
  const [dashboardLayout, setDashboardLayout] = useState(null);
  const [battleDashboardLayout, setBattleDashboardLayout] = useState(null);
  const hasHydratedRef = useRef(false);

  const selectedArmy = useMemo(
    () => KILL_TEAM_ARMIES.find((army) => army.id === armyId) ?? KILL_TEAM_ARMIES[0],
    [armyId]
  );

  const selectedOperative = useMemo(
    () => selectedArmy.operatives.find((operative) => operative.name === memberName) ?? null,
    [memberName, selectedArmy]
  );

  // --- Hydration ---

  useEffect(() => {
    let isMounted = true;

    async function hydrateState() {
      try {
        const appState = await loadAppState();
        if (!isMounted) {
          return;
        }

        if (appState.draftRoster) {
          setArmyId(appState.draftRoster.armyId || DEFAULT_ARMY_ID);
          setArmyName(appState.draftRoster.armyName || "");
          setArmyNotes(appState.draftRoster.armyNotes || "");
          setMembers(
            hydrateMembers(
              appState.draftRoster.armyId || DEFAULT_ARMY_ID,
              Array.isArray(appState.draftRoster.members) ? appState.draftRoster.members : []
            )
          );
        }

        setSavedArmies(
          Array.isArray(appState.savedArmies)
            ? appState.savedArmies.map((army) => ({
                ...army,
                members: hydrateMembers(army.armyId, army.members)
              }))
            : []
        );
        setBattleState(normalizeBattleState(appState.battleState));
        setDashboardLayout(Array.isArray(appState.dashboardLayout) ? appState.dashboardLayout : null);
        setBattleDashboardLayout(Array.isArray(appState.battleDashboardLayout) ? appState.battleDashboardLayout : null);
      } catch {
        if (isMounted) {
          setStorageError("Persistent storage could not be opened. Your roster will only last for this session.");
        }
      } finally {
        if (isMounted) {
          hasHydratedRef.current = true;
          setIsLoadingState(false);
        }
      }
    }

    hydrateState();

    return () => {
      isMounted = false;
    };
  }, []);

  // --- Persistence ---

  useEffect(() => {
    setMemberName("");
  }, [armyId]);

  useEffect(() => {
    if (!hasHydratedRef.current) {
      return;
    }
    saveDraftRoster({ armyId, armyName, armyNotes, members }).catch(() => {
      setStorageError("Changes could not be saved locally. Try smaller images or refresh the page.");
    });
  }, [armyId, armyName, armyNotes, members]);

  useEffect(() => {
    if (!hasHydratedRef.current) {
      return;
    }
    saveSavedArmies(savedArmies).catch(() => {
      setStorageError("Saved armies could not be updated locally. Refresh and try again.");
    });
  }, [savedArmies]);

  useEffect(() => {
    if (!hasHydratedRef.current) {
      return;
    }
    saveBattleState(battleState).catch(() => {
      setStorageError("Battle tracking could not be saved locally. Refresh and try again.");
    });
  }, [battleState]);

  useEffect(() => {
    if (!hasHydratedRef.current) {
      return;
    }
    saveDashboardLayout(dashboardLayout).catch(() => {});
  }, [dashboardLayout]);

  useEffect(() => {
    if (!hasHydratedRef.current) {
      return;
    }
    saveBattleDashboardLayout(battleDashboardLayout).catch(() => {});
  }, [battleDashboardLayout]);

  // --- Builder handlers ---

  const handleAddMember = async (event) => {
    event.preventDefault();
    setError("");
    setSaveArmyMessage("");
    setStorageError("");

    if (!armyName.trim()) {
      setError("Give your army a name first.");
      return;
    }
    if (!memberName) {
      setError("Pick an operative from the dropdown.");
      return;
    }
    if (!cardFile) {
      setError("Upload a card image for this operative.");
      return;
    }

    try {
      setSaving(true);
      const imageDataUrl = await toDataUrl(cardFile);
      const secondImageDataUrl = cardFile2 ? await toDataUrl(cardFile2) : null;

      setMembers((current) => [
        ...current,
        {
          id: createId(),
          operative: memberName,
          wounds: selectedOperative?.wounds ?? null,
          apl: selectedOperative?.apl ?? null,
          move: selectedOperative?.move ?? "",
          save: selectedOperative?.save ?? "",
          tags: selectedOperative?.tags ?? [],
          memberNotes: memberNotes.trim(),
          imageDataUrl,
          imageName: cardFile.name,
          ...(secondImageDataUrl ? { secondImageDataUrl } : {}),
          createdAt: new Date().toISOString()
        }
      ]);

      setCardFile(null);
      setCardFile2(null);
      setMemberNotes("");
      const input = document.getElementById("card-file");
      if (input) {
        input.value = "";
      }
      const input2 = document.getElementById("card-file-2");
      if (input2) {
        input2.value = "";
      }
    } catch {
      setError("Could not store the image. Try another file.");
    } finally {
      setSaving(false);
    }
  };

  const removeMember = (id) => {
    setSaveArmyMessage("");
    setMembers((current) => current.filter((member) => member.id !== id));
  };

  const clearRoster = () => {
    setArmyName("");
    setArmyNotes("");
    setMembers([]);
    setMemberNotes("");
    setCardFile(null);
    setCardFile2(null);
    setError("");
    setSaveArmyMessage("");
    const input = document.getElementById("card-file");
    if (input) {
      input.value = "";
    }
    const input2 = document.getElementById("card-file-2");
    if (input2) {
      input2.value = "";
    }
  };

  const handleSaveArmy = () => {
    setError("");

    if (!armyName.trim()) {
      setError("Name your army before saving it.");
      return;
    }
    if (members.length === 0) {
      setError("Add at least one member with a card image before saving.");
      return;
    }

    const nextArmy = {
      id: createId(),
      armyId,
      armyTypeName: selectedArmy.name,
      faction: selectedArmy.faction,
      armyName: armyName.trim(),
      armyNotes: armyNotes.trim(),
      members,
      savedAt: new Date().toISOString()
    };

    setSavedArmies((current) => [nextArmy, ...current]);
    setSaveArmyMessage("Army saved. You can find it in Overview.");
    setScreen("overview");
  };

  // --- Overview handlers ---

  const deleteSavedArmy = (id) => {
    setSavedArmies((current) => current.filter((army) => army.id !== id));
    setSelectedOverviewArmyIds((current) => current.filter((entry) => entry !== id));
  };

  const startNewArmy = () => {
    setArmyId(DEFAULT_ARMY_ID);
    clearRoster();
    setScreen("builder");
  };

  const formattedSavedArmies = useMemo(
    () =>
      savedArmies.map((army) => ({
        ...army,
        savedAtLabel: new Date(army.savedAt).toLocaleString()
      })),
    [savedArmies]
  );

  const selectedOverviewArmies = useMemo(
    () => savedArmies.filter((army) => selectedOverviewArmyIds.includes(army.id)),
    [savedArmies, selectedOverviewArmyIds]
  );

  const toggleOverviewArmySelection = (id) => {
    setSelectedOverviewArmyIds((current) => {
      if (current.includes(id)) {
        return current.filter((entry) => entry !== id);
      }
      if (current.length >= 2) {
        return [...current.slice(1), id];
      }
      return [...current, id];
    });
  };

  const launchBattle = () => {
    if (selectedOverviewArmies.length === 0 || selectedOverviewArmies.length > 2) {
      setError("Select one or two armies from Overview to start tracking a game.");
      return;
    }
    setBattleState({
      turnNumber: 1,
      armies: selectedOverviewArmies.map((army) => createBattleArmy(army))
    });
    setScreen("battle");
    setError("");
  };

  // --- Battle handlers ---

  const updateBattleTurn = (delta) => {
    setBattleState((current) =>
      current ? { ...current, turnNumber: clamp(current.turnNumber + delta, 1, 10) } : current
    );
  };

  const updateBattleArmyCounter = (battleArmyId, field, delta) => {
    setBattleState((current) => {
      if (!current) {
        return current;
      }
      return {
        ...current,
        armies: current.armies.map((army) =>
          army.id === battleArmyId
            ? { ...army, [field]: clamp((army[field] ?? 0) + delta, 0, 99) }
            : army
        )
      };
    });
  };

  const updateBattleMemberWounds = (battleArmyId, memberId, delta) => {
    setBattleState((current) => {
      if (!current) {
        return current;
      }
      return {
        ...current,
        armies: current.armies.map((army) =>
          army.id === battleArmyId
            ? {
                ...army,
                members: army.members.map((member) =>
                  member.id === memberId
                    ? {
                        ...member,
                        currentWounds: clamp(
                          (member.currentWounds ?? member.maxWounds ?? 0) + delta,
                          0,
                          member.maxWounds ?? 0
                        )
                      }
                    : member
                )
              }
            : army
        )
      };
    });
  };

  const resetBattle = () => {
    setBattleState((current) =>
      current
        ? {
            turnNumber: 1,
            armies: current.armies.map((army) => ({
              ...army,
              victoryPoints: 0,
              commandPoints: 0,
              members: army.members.map((member) => ({
                ...member,
                currentWounds: member.maxWounds ?? member.currentWounds ?? 0
              }))
            }))
          }
        : current
    );
  };

  const endBattle = () => {
    setScreen("overview");
  };

  // --- Render ---

  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Kill Team Roster Builder</p>

        <div className="screen-tabs" role="tablist" aria-label="Page views">
          <button
            type="button"
            className={`tab-button ${screen === "builder" ? "active" : ""}`}
            onClick={() => setScreen("builder")}
          >
            Builder
          </button>
          <button
            type="button"
            className={`tab-button ${screen === "overview" ? "active" : ""}`}
            onClick={() => setScreen("overview")}
          >
            Overview ({savedArmies.length})
          </button>
          <button
            type="button"
            className={`tab-button ${screen === "battle" ? "active" : ""}`}
            onClick={() => setScreen("battle")}
            disabled={!battleState}
          >
            Battle
          </button>
          <button
            type="button"
            className={`tab-button ${screen === "dashboard" ? "active" : ""}`}
            onClick={() => setScreen("dashboard")}
          >
            Dashboard
          </button>
          <button
            type="button"
            className={`tab-button ${screen === "battleboard" ? "active" : ""}`}
            onClick={() => setScreen("battleboard")}
            disabled={!battleState}
          >
            Battle Board
          </button>
        </div>
      </section>

      {storageError ? <p className="panel storage-warning">{storageError}</p> : null}

      {isLoadingState ? (
        <section className="panel loading-panel">
          <h2>Loading saved rosters</h2>
          <p className="intro">Reading locally stored army data and member cards.</p>
        </section>
      ) : null}

      {!isLoadingState && screen === "builder" ? (
        <BuilderPage
          armyId={armyId}
          setArmyId={setArmyId}
          armyName={armyName}
          setArmyName={setArmyName}
          armyNotes={armyNotes}
          setArmyNotes={setArmyNotes}
          memberName={memberName}
          setMemberName={setMemberName}
          memberNotes={memberNotes}
          setMemberNotes={setMemberNotes}
          cardFile={cardFile}
          setCardFile={setCardFile}
          cardFile2={cardFile2}
          setCardFile2={setCardFile2}
          members={members}
          error={error}
          saveArmyMessage={saveArmyMessage}
          saving={saving}
          selectedArmy={selectedArmy}
          selectedOperative={selectedOperative}
          onAddMember={handleAddMember}
          onRemoveMember={removeMember}
          onClearRoster={clearRoster}
          onSaveArmy={handleSaveArmy}
          onGoToOverview={() => setScreen("overview")}
        />
      ) : null}

      {!isLoadingState && screen === "overview" ? (
        <OverviewPage
          formattedSavedArmies={formattedSavedArmies}
          selectedOverviewArmyIds={selectedOverviewArmyIds}
          selectedOverviewArmies={selectedOverviewArmies}
          onToggleSelection={toggleOverviewArmySelection}
          onDeleteArmy={deleteSavedArmy}
          onStartNewArmy={startNewArmy}
          onLaunchBattle={launchBattle}
          hasBuilderData={members.length > 0 || armyName.trim() !== ""}
        />
      ) : null}

      {!isLoadingState && screen === "battle" ? (
        <BattlePage
          battleState={battleState}
          onUpdateTurn={updateBattleTurn}
          onUpdateCounter={updateBattleArmyCounter}
          onUpdateWounds={updateBattleMemberWounds}
          onResetBattle={resetBattle}
          onEndBattle={endBattle}
          onGoToOverview={() => setScreen("overview")}
        />
      ) : null}

      {!isLoadingState && screen === "dashboard" ? (
        <DashboardPage
          formattedSavedArmies={formattedSavedArmies}
          selectedOverviewArmyIds={selectedOverviewArmyIds}
          selectedOverviewArmies={selectedOverviewArmies}
          onToggleSelection={toggleOverviewArmySelection}
          onDeleteArmy={deleteSavedArmy}
          onLaunchBattle={launchBattle}
          battleState={battleState}
          dashboardLayout={dashboardLayout}
          onUpdateDashboardLayout={setDashboardLayout}
        />
      ) : null}

      {!isLoadingState && screen === "battleboard" ? (
        <BattleDashboardPage
          battleState={battleState}
          onUpdateTurn={updateBattleTurn}
          onUpdateCounter={updateBattleArmyCounter}
          onUpdateWounds={updateBattleMemberWounds}
          onResetBattle={resetBattle}
          onEndBattle={() => setScreen("overview")}
          onGoToOverview={() => setScreen("overview")}
          battleDashboardLayout={battleDashboardLayout}
          onUpdateBattleDashboardLayout={setBattleDashboardLayout}
        />
      ) : null}
    </main>
  );
}
