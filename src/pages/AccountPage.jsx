import { useEffect, useState } from "react";

function generateCode(length = 8) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let output = "";
  for (let i = 0; i < length; i += 1) {
    output += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return output;
}

export default function AccountPage({
  accountProfile,
  gameSession,
  publishableArmies,
  sessionArmies,
  supabaseReady,
  syncMessage,
  onSaveAccount,
  onCreateSession,
  onJoinSession,
  onClearSession,
  onPublishArmy,
  onRefreshSessionArmies,
  onImportSessionArmy,
}) {
  const [displayName, setDisplayName] = useState(accountProfile?.displayName ?? "");
  const [joinCode, setJoinCode] = useState("");
  const [selectedArmyId, setSelectedArmyId] = useState("");

  useEffect(() => {
    setDisplayName(accountProfile?.displayName ?? "");
  }, [accountProfile]);

  useEffect(() => {
    if (!selectedArmyId && publishableArmies.length > 0) {
      setSelectedArmyId(publishableArmies[0].id);
    }
  }, [publishableArmies, selectedArmyId]);

  const accountCode = accountProfile?.userCode ?? "";

  const ensureLocalAccount = () => {
    const trimmedName = displayName.trim();
    if (accountCode) {
      return accountCode;
    }
    if (!trimmedName) {
      return null;
    }

    const nextCode = generateCode(10);
    onSaveAccount({
      displayName: trimmedName,
      userCode: nextCode,
      updatedAt: new Date().toISOString(),
    });
    return nextCode;
  };

  const handleSaveAccount = () => {
    const trimmedName = displayName.trim();
    if (!trimmedName) {
      return;
    }

    onSaveAccount({
      displayName: trimmedName,
      userCode: accountCode || generateCode(10),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleCreateSession = () => {
    if (!ensureLocalAccount()) {
      return;
    }

    onCreateSession({
      code: generateCode(6),
      role: "host",
      createdAt: new Date().toISOString(),
      status: "waiting",
    });
  };

  const handleJoinSession = () => {
    const code = joinCode.trim().toUpperCase();
    if (!code) {
      return;
    }
    if (!ensureLocalAccount()) {
      return;
    }

    onJoinSession({
      code,
      role: "guest",
      createdAt: new Date().toISOString(),
      status: "pending-connection",
    });
  };

  const handlePublishArmy = () => {
    if (!selectedArmyId) {
      return;
    }
    onPublishArmy(selectedArmyId);
  };

  return (
    <section className="account-grid">
      <section className="panel account-panel">
        <h2>Account</h2>
        <p className="intro">
          Create a local account now so your identity and invite flow are ready for multiplayer sync.
        </p>

        <label htmlFor="display-name">Display Name</label>
        <input
          id="display-name"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="e.g. Matt"
          maxLength={40}
        />

        <div className="account-code-row">
          <p className="roster-meta">
            <strong>User Code:</strong> {accountCode || "Not created yet"}
          </p>
          <button type="button" className="ghost" onClick={handleSaveAccount}>
            {accountCode ? "Update Account" : "Create Account"}
          </button>
        </div>

        <p className={`roster-meta ${supabaseReady ? "" : "roster-full-warning"}`}>
          <strong>Realtime:</strong> {supabaseReady ? "Supabase connected" : "Supabase not configured"}
        </p>
      </section>

      <section className="panel account-panel">
        <h2>Game Session</h2>
        <p className="intro">
          Create a session code to host, or enter a code to join. This is the UI layer; live sync can be added via Supabase, Firebase, or a lightweight WebSocket service.
        </p>

        <div className="button-row">
          <button type="button" onClick={handleCreateSession}>
            Create Game Code
          </button>
          <button type="button" className="ghost" onClick={onClearSession} disabled={!gameSession}>
            Clear Session
          </button>
          <button
            type="button"
            className="ghost"
            onClick={onRefreshSessionArmies}
            disabled={!gameSession}
          >
            Refresh Session Armies
          </button>
        </div>

        <label htmlFor="join-code">Join Code</label>
        <div className="account-join-row">
          <input
            id="join-code"
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="Enter code"
            maxLength={12}
          />
          <button type="button" className="ghost" onClick={handleJoinSession}>
            Join
          </button>
        </div>

        {!accountCode ? (
          <p className="roster-meta roster-full-warning">
            Enter a display name above. Creating or joining a session will then create your local account automatically.
          </p>
        ) : null}

        {syncMessage ? <p className="roster-meta">{syncMessage}</p> : null}

        <div className="account-session-card">
          <p className="roster-meta">
            <strong>Current Session:</strong> {gameSession?.code || "None"}
          </p>
          <p className="roster-meta">
            <strong>Role:</strong> {gameSession?.role || "-"}
          </p>
          <p className="roster-meta">
            <strong>Status:</strong> {gameSession?.status || "-"}
          </p>
        </div>

        <h3 className="account-subtitle">Publish Army To Session</h3>
        <p className="roster-meta">User A can publish here, and the host can import from the shared list below.</p>
        <div className="account-join-row">
          <select
            value={selectedArmyId}
            onChange={(e) => setSelectedArmyId(e.target.value)}
            disabled={!gameSession || publishableArmies.length === 0}
          >
            {publishableArmies.length === 0 ? (
              <option value="">No armies available</option>
            ) : (
              publishableArmies.map((army) => (
                <option key={army.id} value={army.id}>
                  {army.armyName} ({army.armyTypeName})
                </option>
              ))
            )}
          </select>
          <button
            type="button"
            onClick={handlePublishArmy}
            disabled={!gameSession || !selectedArmyId || !supabaseReady}
          >
            Publish
          </button>
        </div>

        <h3 className="account-subtitle">Session Armies</h3>
        {sessionArmies.length === 0 ? (
          <p className="roster-meta">No shared armies in this session yet.</p>
        ) : (
          <ul className="account-session-army-list">
            {sessionArmies.map((row) => (
              <li key={row.id} className="account-session-army-item">
                <div>
                  <p className="roster-meta"><strong>{row.army_name}</strong> ({row.army_type_name})</p>
                  <p className="roster-meta">Owner: {row.owner_name || row.owner_code}</p>
                </div>
                {gameSession?.role === "host" ? (
                  <button type="button" className="ghost" onClick={() => onImportSessionArmy(row)}>
                    Import To Dashboard
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}
