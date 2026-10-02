import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { exams, isLeafSubtest, subtestGroups, type Material } from "@/data/prototype";
import { CardGrid, SelectCard, StepHeader } from "./select-card";

/** Latihan Soal: structured, system-guided progression. Category → Subtest → Material → guided session. */
export function LatihanMode() {
  const navigate = useNavigate();
  const [examId, setExamId] = useState<string | null>(null);
  const [subtestId, setSubtestId] = useState<string | null>(null);
  const [group, setGroup] = useState<string | null>(null);
  const exam = exams.find((e) => e.id === examId);
  const subtest = exam?.subtests.find((s) => s.id === subtestId);
  const start = (examId: string, subtestId: string, m: Material) =>
    navigate({ to: "/session/$examId/$subtestId/$materialId", params: { examId, subtestId, materialId: m.id }, search: { mode: "latihan" } });

  if (!exam)
    return (
      <>
        <StepHeader trail={["Latihan Soal"]} title="Pilih kategori" caption="Latihan bertahap — kami yang mengatur urutannya." />
        <CardGrid cols={3}>
          {exams.map((e) => (
            <SelectCard key={e.id} title={e.name} description={e.caption} meta={`${e.subtests.length} subtes`} onClick={() => setExamId(e.id)} />
          ))}
        </CardGrid>
      </>
    );

  if (!subtest)
    return (
      <>
        <StepHeader trail={["Latihan Soal", exam.name]} title="Pilih subtes" onBack={() => setExamId(null)} />
        <CardGrid cols={3}>
          {exam.subtests.map((s) => {
            const done = s.materials.reduce((n, m) => n + m.completed, 0);
            const total = s.materials.reduce((n, m) => n + m.total, 0);
            return <SelectCard key={s.id} title={s.name} description={s.caption} progress={Math.round((done / total) * 100)} onClick={() => (isLeafSubtest(s) ? start(exam.id, s.id, s.materials[0]!) : setSubtestId(s.id))} />;
          })}
        </CardGrid>
      </>
    );

  const groups = subtestGroups(subtest);
  if (groups.length && !group)
    return (
      <>
        <StepHeader trail={["Latihan Soal", exam.name, subtest.name]} title="Pilih kelompok" onBack={() => setSubtestId(null)} />
        <CardGrid>
          {groups.map((g) => {
            const ms = subtest.materials.filter((m) => m.group === g);
            const done = ms.reduce((n, m) => n + m.completed, 0);
            const total = ms.reduce((n, m) => n + m.total, 0);
            return <SelectCard key={g} title={g} description={`${ms.length} materi`} progress={Math.round((done / total) * 100)} onClick={() => setGroup(g)} />;
          })}
        </CardGrid>
      </>
    );
  const list = group ? subtest.materials.filter((m) => m.group === group) : subtest.materials;

  // Recommended next material = first not yet finished; the system guides the order.
  const nextIdx = list.findIndex((m) => m.completed < m.total);
  return (
    <>
      <StepHeader trail={["Latihan Soal", exam.name, subtest.name, ...(group ? [group] : [])]} title="Pilih materi" caption="Mulai dari materi yang direkomendasikan untuk progres terbaik." onBack={() => (group ? setGroup(null) : setSubtestId(null))} />
      <CardGrid cols={3}>
        {list.map((m, i) => (
          <SelectCard
            key={m.id}
            title={m.name}
            description={`Langkah ${i + 1} · ${m.completed}/${m.total} soal selesai`}
            progress={Math.round((m.completed / m.total) * 100)}
            badge={i === nextIdx ? "Berikutnya" : undefined}
            onClick={() => start(exam.id, subtest.id, m)}
          />
        ))}
      </CardGrid>
    </>
  );
}

