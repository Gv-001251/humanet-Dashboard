// This file contains the updated employee card rendering logic for AutoMatch
// To be integrated into the main file

{project.suggestedEmployees.map((employee, index) => {
  const isSelected = project.selectedEmployeeIds.includes(employee.id);
  const isRecommended = index < project.recommendedTeamSize;
  return (
    <div
      key={employee.id}
      className={`border-2 rounded-xl p-5 transition-all bg-white ${
        isSelected
          ? 'border-brand-primary shadow-subtle ring-1 ring-brand-primary/20'
          : 'border-neutral-border hover:border-brand-primary/60'
      }`}
    >
      {/* Employee Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {employee.name.charAt(0)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h5 className="text-lg font-bold text-neutral-text">{employee.name}</h5>
              {index === 0 && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-semibold inline-flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Top Match
                </span>
              )}
              {isRecommended && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded">
                  Recommended
                </span>
              )}
              {!isRecommended && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-600 rounded">
                  Additional suggestion
                </span>
              )}
              {isSelected && (
                <span className="px-2 py-0.5 text-xs font-semibold text-brand-primary bg-brand-primary/10 rounded">
                  Selected for team
                </span>
              )}
            </div>
            <p className="text-sm text-neutral-subtler">{employee.role}</p>
            <p className="text-xs text-neutral-muted mt-1">{employee.experience} of experience</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className={`flex flex-col items-center justify-center w-20 h-20 rounded-xl border-2 ${getMatchScoreColor(employee.matchScore)}`}>
            <span className="text-2xl font-bold">{employee.matchScore}</span>
            <span className="text-xs font-medium">Match</span>
          </div>
          {project.status === 'matched' && (
            <button
              onClick={() => toggleEmployeeSelection(project.id, employee.id)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                isSelected
                  ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                  : 'bg-white text-neutral-text border-neutral-border hover:border-brand-primary hover:text-brand-primary'
              }`}
            >
              {isSelected ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <PlusCircle className="w-4 h-4" />
              )}
              {isSelected ? 'Selected' : 'Add to team'}
            </button>
          )}
        </div>
      </div>

      {/* Rest of employee card content remains the same */}
      {/* ... */}
    </div>
  );
})}
