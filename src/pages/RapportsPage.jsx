import { useEffect, useState } from 'react';
import { Download, FileText, BarChart2, Eye, EyeOff } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

function RapportsPage() {
  const { isLecteur } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showInventaire, setShowInventaire] = useState(false);
  const [showSynthese, setShowSynthese] = useState(false);

  useEffect(() => {
    api.get('/applications').then((res) => setApplications(res.data));
  }, []);

  const exportInventairePDF = () => {
    setLoading(true);
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(13, 27, 110);
    doc.text('Inventaire des Applications', 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`YAS Sénégal — IT Factory`, 14, 28);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 34);
    autoTable(doc, {
      startY: 42,
      head: [['Nom', 'Version', 'État', 'Criticité', 'Catégorie', 'Équipe']],
      body: applications.map((app) => [
        app.nomApplication, app.version, app.etat, app.criticite,
        app.categorie?.nomCategorie || '—', app.equipeResponsable?.nomEquipe || '—',
      ]),
      headStyles: { fillColor: [13, 27, 110], textColor: 255, fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Page ${i} sur ${pageCount} — ParcApp YAS Sénégal`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    }
    doc.save(`inventaire_applications_${new Date().toISOString().split('T')[0]}.pdf`);
    setLoading(false);
  };

  const exportSynthesePDF = () => {
    setLoading(true);
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.setFontSize(18);
    doc.setTextColor(13, 27, 110);
    doc.text('Rapport de synthèse — Parc Applicatif', 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`YAS Sénégal — Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 28);
    autoTable(doc, {
      startY: 38,
      head: [['Indicateur', 'Valeur']],
      body: [
        ['Total applications', applications.length],
        ['Applications vitales', applications.filter(a => a.criticite === 'Vitale').length],
        ['Applications en service', applications.filter(a => a.etat === 'En service').length],
        ['Applications obsolètes', applications.filter(a => a.etat === 'Obsolète').length],
        ['Applications en projet', applications.filter(a => a.etat === 'En projet').length],
        ['À décommissionner', applications.filter(a => a.etat === 'A décommissionner').length],
      ],
      headStyles: { fillColor: [13, 27, 110], textColor: 255, fontStyle: 'bold' },
      bodyStyles: { fontSize: 10 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: { 1: { halign: 'center', fontStyle: 'bold' } },
    });
    doc.save(`synthese_${new Date().toISOString().split('T')[0]}.pdf`);
    setLoading(false);
  };

  // Composant tableau inventaire
  const TableauInventaire = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#0D1B6E]">
            <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider">Nom</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider">Version</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider">État</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider">Criticité</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider">Catégorie</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider">Équipe</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {applications.length === 0 ? (
            <tr><td colSpan={6} className="text-center py-8 text-gray-400 text-sm">Aucune application</td></tr>
          ) : (
            applications.map((app) => (
              <tr key={app.idApplication} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="px-5 py-3 text-sm font-medium text-gray-800">{app.nomApplication}</td>
                <td className="px-5 py-3 text-sm text-gray-500">{app.version}</td>
                <td className="px-5 py-3 text-sm text-gray-600">{app.etat}</td>
                <td className="px-5 py-3 text-sm text-gray-600">{app.criticite}</td>
                <td className="px-5 py-3 text-sm text-gray-500">{app.categorie?.nomCategorie || '—'}</td>
                <td className="px-5 py-3 text-sm text-gray-500">{app.equipeResponsable?.nomEquipe || '—'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  // Composant tableau synthèse
  const TableauSynthese = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#FFD100]">
            <th className="text-left px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider">Indicateur</th>
            <th className="text-center px-5 py-3 text-xs font-semibold text-white uppercase tracking-wider">Valeur</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {[
            ['Total applications', applications.length],
            ['Applications vitales', applications.filter(a => a.criticite === 'Vitale').length],
            ['Applications en service', applications.filter(a => a.etat === 'En service').length],
            ['Applications obsolètes', applications.filter(a => a.etat === 'Obsolète').length],
            ['Applications en projet', applications.filter(a => a.etat === 'En projet').length],
            ['À décommissionner', applications.filter(a => a.etat === 'A décommissionner').length],
          ].map(([label, val], i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-[#F8FAFC]' : 'bg-white'}>
              <td className="px-5 py-3 text-sm text-gray-700">{label}</td>
              <td className="px-5 py-3 text-sm font-bold text-[#0D1B6E] text-center">{val}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex justify-center mt-4 text-2xl font-bold text-gray-900">Rapports</h1>
        <p className="text-[#0D1B6E] text-2xl mt-1 font-medium">
          {isLecteur ? "Consultez l'inventaire des applications" : 'Consultez et exportez les données du parc applicatif'}
        </p>
      </div>

      {/* Support / Admin : cartes avec bouton œil + télécharger */}
      {!isLecteur && (
        <div className="grid grid-cols-2 gap-5">
          {/* Inventaire */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#0D1B6E] rounded-xl">
                <FileText size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-800">Inventaire des applications</h2>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Exportez un tableau PDF contenant toutes les applications avec leur nom, version, état, criticité, catégorie et équipe.
            </p>
            <div className="flex items-center justify-end gap-2 mt-2">
              <button
                onClick={() => setShowInventaire(!showInventaire)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#0D1B6E] text-white rounded-xl text-sm font-medium hover:bg-[#E6BC00] transition-colors"
              >
                {showInventaire ? <EyeOff size={15} /> : <Eye size={15} />}
                {showInventaire ? 'Masquer' : 'Aperçu'}
              </button>
              <button
                onClick={exportInventairePDF}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#0D1B6E] text-white rounded-xl text-sm font-medium hover:bg-[#E6BC00] transition-colors"
              >
                <Download size={15} />
                Télécharger PDF
              </button>
            </div>
            {showInventaire && (
              <div className="mt-2 rounded-xl border border-gray-100 overflow-hidden">
                <TableauInventaire />
              </div>
            )}
          </div>

          {/* Synthèse */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#FFD100] rounded-xl">
                <BarChart2 size={20} className="text-[#0D1B6E]" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-800">Rapport de synthèse</h2>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Exportez un rapport PDF avec les chiffres clés du parc applicatif : totaux, répartition par état et criticité.
            </p>
            <div className="flex items-center justify-end gap-2 mt-2">
              <button
                onClick={() => setShowSynthese(!showSynthese)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#FFD100] text-[#0D1B6E] rounded-xl text-sm font-medium hover:opacity-90 transition-colors"
              >
                {showSynthese ? <EyeOff size={15} /> : <Eye size={15} />}
                {showSynthese ? 'Masquer' : 'Aperçu'}
              </button>
              <button
                onClick={exportSynthesePDF}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#FFD100] text-[#0D1B6E] rounded-xl text-sm font-medium hover:opacity-90 transition-colors"
              >
                <Download size={15} />
                Télécharger PDF
              </button>
            </div>
            {showSynthese && (
              <div className="mt-2 rounded-xl border border-gray-100 overflow-hidden">
                <TableauSynthese />
              </div>
            )}
          </div>
        </div>
      )}

      {isLecteur && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#0D1B6E] rounded-xl">
                <FileText size={20} className="text-white" />
              </div>
              <h2 className="text-base font-semibold text-gray-800">Inventaire des applications</h2>
            </div>
            <div className="rounded-xl border border-gray-100 overflow-hidden">
              <TableauInventaire />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#FFD100] rounded-xl">
                <BarChart2 size={20} className="text-[#0D1B6E]" />
              </div>
              <h2 className="text-base font-semibold text-gray-800">Rapport de synthèse</h2>
            </div>
            <div className="rounded-xl border border-gray-100 overflow-hidden">
              <TableauSynthese />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RapportsPage;