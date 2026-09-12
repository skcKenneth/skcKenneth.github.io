"""Original teaching models. Synthetic experiments, not empirical validation.

Shared verbatim by CPython, the browser worker and standalone notebook exports.
No hidden files, network calls, or global random state are required.
"""
import base64
import csv
import io
import json
import math
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from scipy.integrate import solve_ivp
from scipy.optimize import least_squares, linprog

VERSION = "1.0.0"
SLUGS = ["mixing-tank", "population-inference", "sir-dynamics", "agent-simulation", "resource-allocation", "diffusion"]
DEFAULTS = {
    "mixing-tank": dict(flow=2.0, volume=20.0, reaction=0.05, inlet=10.0, initial=0.0, dt=0.5),
    "population-inference": dict(growth=0.35, capacity=120.0, noise=2.0, train_end=8.0),
    "sir-dynamics": dict(beta=0.35, gamma=0.1, intervention=30.0, reduction=0.5, dt=0.5),
    "agent-simulation": dict(size=16, vacancy=0.2, threshold=0.5, sweeps=20, repeats=12),
    "resource-allocation": dict(labor=40.0, material=50.0, profit_x=30.0, profit_y=20.0),
    "diffusion": dict(cells=30, diffusivity=0.1, ratio=0.4, end=0.2, boundary="fixed"),
}

def check(en, zh, passed, detail=""):
    return dict(en=en, zh=zh, passed=bool(passed), detail=str(detail))

def figure_payload(fig, en, zh):
    fig.tight_layout()
    stream = io.BytesIO()
    fig.savefig(stream, format="png", dpi=120, metadata={"Software": "Modeling Workshop"})
    plt.close(fig)
    return dict(en=en, zh=zh, png=base64.b64encode(stream.getvalue()).decode("ascii"))

def table_csv(headers, rows):
    s = io.StringIO(newline="")
    w = csv.writer(s)
    w.writerow(headers)
    w.writerows(rows)
    return s.getvalue()

def time_grid(end, dt):
    if not np.isfinite(dt) or dt <= 0:
        raise ValueError("dt must be positive / 步長必須為正")
    n = int(np.ceil(end / dt))
    if n > 10000:
        raise ValueError("At most 10000 time steps / 最多 10000 個時間步")
    return np.linspace(0, end, n + 1)

def explicit_integrate(rhs, y0, t, method="euler"):
    y = np.empty((len(t), len(np.atleast_1d(y0))))
    y[0] = y0
    for i, h in enumerate(np.diff(t)):
        x = y[i]
        k1 = np.asarray(rhs(t[i], x))
        if method == "rk4":
            k2 = np.asarray(rhs(t[i] + h/2, x + h*k1/2))
            k3 = np.asarray(rhs(t[i] + h/2, x + h*k2/2))
            k4 = np.asarray(rhs(t[i] + h, x + h*k3))
            y[i+1] = x + h*(k1 + 2*k2 + 2*k3 + k4)/6
        else:
            y[i+1] = x + h*k1
    return y

def tank_rhs(c, flow, volume, reaction, inlet):
    return flow / volume * (inlet - c) - reaction * c

def tank_exact(t, p):
    rate = p["flow"] / p["volume"] + p["reaction"]
    steady = (p["flow"] / p["volume"] * p["inlet"]) / rate
    return steady + (p["initial"] - steady) * np.exp(-rate * np.asarray(t))

def mixing_tank(p, seed, student, integrator=explicit_integrate):
    t = time_grid(60, p["dt"])
    rhs = lambda _, c: tank_rhs(c, p["flow"], p["volume"], p["reaction"], p["inlet"])
    exact = tank_exact(t, p)
    euler = explicit_integrate(rhs, [p["initial"]], t)[:, 0]
    fine_t = time_grid(60, p["dt"]/2)
    fine = explicit_integrate(rhs, [p["initial"]], fine_t)[:, 0]
    scipy_y = solve_ivp(rhs, [0, 60], [p["initial"]], t_eval=t, rtol=1e-9, atol=1e-11).y[0]
    learned_rhs = lambda _, c: student(c, p["flow"], p["volume"], p["reaction"], p["inlet"])
    learned = np.asarray(integrator(learned_rhs, [p["initial"]], t))[:, 0]
    learned_fine = np.asarray(integrator(learned_rhs, [p["initial"]], fine_t))[:, 0]
    err = float(np.max(np.abs(euler-exact)))
    fine_err = float(np.max(np.abs(fine-tank_exact(fine_t,p))))
    fig, ax = plt.subplots(figsize=(6.6,3.8))
    ax.plot(t, exact, color="#1f6652", label="Analytic baseline")
    ax.plot(t, learned, "--", color="#a24b32", label="Your Euler model")
    ax.plot(t, scipy_y, ":", color="#405cad", label="solve_ivp")
    ax.set(xlabel="Time (min)", ylabel="Concentration (g/L)"); ax.legend()
    points=np.array([0.,2.,7.])
    matches=np.allclose(student(points,p["flow"],p["volume"],p["reaction"],p["inlet"]),rhs(0,points),rtol=1e-10,atol=1e-10)
    rate=p["flow"]/p["volume"]+p["reaction"]
    zero={**p,"reaction":0.0}
    algorithm_ok = np.allclose(integrator(lambda _, y:-y,[1.],np.array([0.,.1,.2])),[[1.],[.9],[.81]],rtol=1e-10,atol=1e-10)
    return dict(metrics={"Euler max error (g/L)":err,"Half-step max error (g/L)":fine_err,"Your Euler max error (g/L)":float(abs(learned-exact).max()),"Your half-step max error (g/L)":float(abs(learned_fine-tank_exact(fine_t,p)).max()),"Residence time (min)":p["volume"]/p["flow"],"Damkohler number":p["reaction"]*p["volume"]/p["flow"],"h × decay rate":float((t[1]-t[0])*rate)},
        checks=[check("Your Euler loop passes a two-step hand calculation","你的 Euler 迴圈通過兩步手算",algorithm_ok),check("Your balance matches inflow − outflow − reaction", "你的平衡式符合流入−流出−反應",matches),check("solve_ivp matches analytic solution","solve_ivp 與解析解相符",np.allclose(scipy_y,exact,rtol=1e-7,atol=1e-8)),check("Halving the step reduces Euler error","步長減半可降低 Euler 誤差",fine_err <= err+1e-12),check("Your concentration stays nonnegative","你的濃度保持非負",np.all(learned>=-1e-10)),check("Zero reaction tends to inlet concentration","零反應的長期濃度趨近入口濃度",abs(tank_exact(1e5,zero)-p["inlet"])<1e-8)],
        figures=[figure_payload(fig,"Concentration: reference and your implementation","濃度：參照解與你的實作")],csv=table_csv(["time_min","analytic_g_L","your_euler_g_L","scipy_g_L"],zip(t,exact,learned,scipy_y)))

def logistic(t, r, capacity, initial=5.0):
    return capacity / (1 + (capacity / initial - 1) * np.exp(-r * np.asarray(t)))

def population_inference(p, seed, student):
    rng=np.random.default_rng(seed)
    t=np.linspace(0,20,41); truth=logistic(t,p["growth"],p["capacity"])
    observations=truth+rng.normal(0,p["noise"],len(t))
    train=t<=p["train_end"]; test=~train
    def fit(mask, predictor):
        return least_squares(lambda q: np.asarray(predictor(t[mask],q[0],q[1]))-observations[mask],[0.25,100],bounds=([0.01,10],[1.5,1000]),max_nfev=300)
    early=fit(train,logistic); full=fit(np.ones(len(t),bool),logistic); mine=fit(train,student)
    expfit=least_squares(lambda q:5*np.exp(q[0]*t[train])-observations[train],[0.2],bounds=([0],[1.5]))
    pred=student(t,*mine.x); base=logistic(t,*early.x); exponential=5*np.exp(expfit.x[0]*t)
    rgrid=np.linspace(.1,.65,36); kgrid=np.linspace(40,300,40)
    loss=np.array([[np.mean((logistic(t[train],r,k)-observations[train])**2) for k in kgrid] for r in rgrid])
    fig,axs=plt.subplots(1,2,figsize=(9,3.6))
    axs[0].scatter(t[train],observations[train],s=14,label="Calibration observations",color="#1f6652")
    axs[0].scatter(t[test],observations[test],s=17,marker="x",label="Held-out observations",color="#a24b32")
    axs[0].plot(t,pred,"--",label="Your fitted model");axs[0].plot(t,logistic(t,*full.x),":",label="Full-data fit (diagnostic)")
    axs[0].set(xlabel="Time (day)",ylabel="Population (individuals)");axs[0].legend(fontsize=7)
    mesh=axs[1].contourf(kgrid,rgrid,np.log10(loss+1e-8),levels=15,cmap="cividis")
    axs[1].set(xlabel="Capacity K (individuals)",ylabel="Growth r (1/day)");fig.colorbar(mesh,ax=axs[1],label="log10 calibration MSE")
    fig2,ax=plt.subplots(figsize=(6.6,3.2));ax.axhline(0,color="grey",lw=1);ax.scatter(t,observations-pred,c=np.where(train,0,1),cmap="cividis");ax.set(xlabel="Time (day)",ylabel="Observation − prediction")
    rmse=lambda x:float(np.sqrt(np.mean(np.asarray(x)**2)))
    return dict(metrics={"Estimated r (1/day)":float(mine.x[0]),"Estimated K":float(mine.x[1]),"Calibration RMSE":rmse(pred[train]-observations[train]),"Held-out RMSE":rmse(pred[test]-observations[test]),"Exponential held-out RMSE":rmse(exponential[test]-observations[test]),"Full-data K (diagnostic only)":float(full.x[1]),"Reference Jacobian condition number":float(np.linalg.cond(early.jac))},
      checks=[check("Your formula matches the logistic solution","你的公式符合 Logistic 解",np.allclose(student(np.array([0,3,10]),.3,120),logistic(np.array([0,3,10]),.3,120),rtol=1e-9)),check("Predictions are finite and positive","預測為有限正值",np.all(np.isfinite(pred)) and np.all(pred>0)),check("Calibration and held-out rows do not overlap","校準與保留資料互不重疊",not np.any(train&test) and np.any(test)),check("Solver converged (does not establish identifiability)","求解器已收斂（不代表參數可辨識）",mine.success)],
      figures=[figure_payload(fig,"Fit and calibration loss surface","擬合與校準損失曲面"),figure_payload(fig2,"Residuals across calibration and held-out times","校準與保留時段的殘差")],csv=table_csv(["time_day","synthetic_truth","observation","calibration","prediction","baseline_prediction"],zip(t,truth,observations,train.astype(int),pred,base)))

def sir_rhs(y, beta, gamma):
    s,i,r=y; incidence=beta*s*i/1000.0
    return np.array([-incidence,incidence-gamma*i,gamma*i])

def sir_solution(p,t,method="reference",rhs=sir_rhs):
    # Split exactly at the intervention so adaptive methods never step over it.
    switch=p["intervention"]; out=np.empty((len(t),3)); state=np.array([990.,10.,0.])
    for a,b,beta in [(0.,switch,p["beta"]),(switch,100.,p["beta"]*(1-p["reduction"]))]:
        mask=(t>=a)&(t<=b); ts=np.unique(np.r_[a,t[mask],b])
        f=lambda _,y:rhs(y,beta,p["gamma"])
        if method=="reference":
            sol=solve_ivp(f,[a,b],state,t_eval=ts,rtol=1e-9,atol=1e-10).y.T
        else: sol=explicit_integrate(f,state,ts,method)
        out[mask]=sol[np.searchsorted(ts,t[mask])];state=sol[-1]
    return out

def sir_dynamics(p,seed,student):
    t=time_grid(100,p["dt"]);ref=sir_solution(p,t);mine=sir_solution(p,t,"euler",student)
    rk=sir_solution(p,t,"rk4");coarse=sir_solution(p,t,"euler")
    tf=time_grid(100,p["dt"]/2);fine=sir_solution(p,tf,"euler");rf=sir_solution(p,tf)
    fig,ax=plt.subplots(figsize=(6.6,3.8))
    for j,label in enumerate(["S","I","R"]):
        ax.plot(t,ref[:,j],color=["#1f6652","#a24b32","#405cad"][j],label=f"Reference {label}")
    ax.plot(t,mine[:,1],"--",color="#18201d",label="Your Euler I");ax.axvline(p["intervention"],ls=":",color="grey")
    ax.set(xlabel="Time (day)",ylabel="Population (persons)");ax.legend(fontsize=8)
    no=sir_solution({**p,"beta":0},t)
    return dict(metrics={"Initial effective reproduction ratio":p["beta"]*0.99/p["gamma"],"Reference peak I":float(ref[:,1].max()),"Euler max error (persons)":float(abs(coarse-ref).max()),"RK4 max error (persons)":float(abs(rk-ref).max()),"Half-step Euler max error":float(abs(fine-rf).max()),"Your population drift":float(abs(mine.sum(axis=1)-1000).max())},
      checks=[check("Your transition rates match the model","你的狀態轉移率符合模型",np.allclose(student([900.,80.,20.],.3,.1),sir_rhs([900.,80.,20.],.3,.1))),check("Your population is conserved","你的人口總數守恆",np.allclose(mine.sum(axis=1),1000,atol=1e-6)),check("Your compartments remain nonnegative","你的各組人口保持非負",np.all(mine>=-1e-8)),check("No transmission gives exponential recovery","無傳播時感染者按指數下降",np.allclose(no[:,1],10*np.exp(-p["gamma"]*t),atol=1e-6)),check("Euler error decreases with step refinement","加密時間步可降低 Euler 誤差",abs(fine-rf).max()<=abs(coarse-ref).max()+1e-9)],
      figures=[figure_payload(fig,"SIR dynamics with a piecewise intervention","分段介入下的 SIR 動態")],csv=table_csv(["time_day","S_reference","I_reference","R_reference","I_your_euler","I_RK4"],zip(t,*ref.T,mine[:,1],rk[:,1])))

def same_fraction(grid,row,col):
    # Periodic Moore neighborhood; an isolated agent is satisfied by convention.
    n=len(grid);agent=grid[row,col]
    values=[grid[(row+dr)%n,(col+dc)%n] for dr in [-1,0,1] for dc in [-1,0,1] if dr or dc]
    occupied=[v for v in values if v!=0]
    return sum(v==agent for v in occupied)/len(occupied) if occupied else 1.0

def agent_run(p,seed,mode="sequential",fraction=same_fraction,keep_frames=False):
    rng=np.random.default_rng(seed);n=int(p["size"]);count=n*n;empty=int(round(count*p["vacancy"]))
    occupied=count-empty;grid=np.array([0]*empty+[1]*(occupied//2)+[2]*(occupied-occupied//2),dtype=int)
    rng.shuffle(grid);grid=grid.reshape(n,n);initial=grid.copy();frames=[grid.tolist()] if keep_frames else []
    history=[]
    for sweep in range(int(p["sweeps"])):
        snapshot=grid.copy();positions=rng.permutation(np.argwhere(snapshot!=0))
        # Snapshot mode reserves initially empty sites; each agent moves at most once.
        vacancies=[tuple(x) for x in np.argwhere(snapshot==0)]
        rng.shuffle(vacancies)
        for row,col in positions:
            basis=snapshot if mode=="snapshot" else grid
            if grid[row,col]==0 or fraction(basis,int(row),int(col))>=p["threshold"]:continue
            if mode=="snapshot":
                if not vacancies:break
                target=vacancies.pop()
            else:
                options=np.argwhere(grid==0)
                if not len(options):break
                target=tuple(options[rng.integers(len(options))])
            grid[target]=grid[row,col];grid[row,col]=0
        scores=[same_fraction(grid,int(r),int(c)) for r,c in np.argwhere(grid!=0)]
        history.append(float(np.mean(scores)))
        if keep_frames:frames.append(grid.tolist())
    return initial,grid,np.array(history),frames

def agent_simulation(p,seed,student):
    initial,final,hist,frames=agent_run(p,seed,fraction=student,keep_frames=True)
    _,ref,rhist,_=agent_run(p,seed)
    _,snap,shist,_=agent_run(p,seed,"snapshot")
    repeats=int(p["repeats"])
    seq=np.array([agent_run(p,seed+i)[2][-1] for i in range(repeats)])
    alt=np.array([agent_run(p,seed+i,"snapshot")[2][-1] for i in range(repeats)])
    diff=seq-alt;se=float(diff.std(ddof=1)/np.sqrt(repeats))
    fig,axs=plt.subplots(1,3,figsize=(9,3))
    from matplotlib.colors import ListedColormap
    cmap=ListedColormap(["#f5f3ed","#1f6652","#cf843b"])
    for ax,g,title in zip(axs,[initial,final,snap],["Initial","Your sequential rules","Reference snapshot rules"]):
        ax.imshow(g,vmin=0,vmax=2,cmap=cmap);ax.set_title(title,fontsize=9);ax.set(xlabel="Column",ylabel="Row")
    fig2,ax=plt.subplots(figsize=(6.6,3.3));ax.plot(range(1,len(hist)+1),hist,label="Your sequential");ax.plot(range(1,len(rhist)+1),rhist,"--",label="Reference sequential");ax.plot(range(1,len(shist)+1),shist,":",label="Reference snapshot");ax.set(xlabel="Sweep",ylabel="Mean same-type neighbor fraction");ax.legend(fontsize=8)
    toy=np.array([[0,0,0],[0,1,1],[0,2,0]])
    return dict(metrics={"Mean sequential − snapshot score":float(diff.mean()),"Approximate 95% CI lower":float(diff.mean()-1.96*se),"Approximate 95% CI upper":float(diff.mean()+1.96*se),"Replications":repeats,"Your final same-type fraction":float(hist[-1])},
      checks=[check("Your neighborhood rule passes a hand-worked case","你的鄰域規則通過手算案例",np.isclose(student(toy,1,1),.5)),check("Your simulation preserves each population count","你的模擬保持各類人口數",np.array_equal(np.bincount(initial.ravel(),minlength=3),np.bincount(final.ravel(),minlength=3))),check("Same seed reproduces your grid","相同種子重現你的網格",np.array_equal(final,agent_run(p,seed,fraction=student)[1])),check("Scores are in [0, 1]","分數介乎 0 與 1",np.all((hist>=0)&(hist<=1)))],
      figures=[figure_payload(fig,"Vacancy and two abstract agent types; no empirical population labels","空位及兩類抽象代理人；並非真實人口標籤"),figure_payload(fig2,"Emergence depends on update assumptions","湧現結果依賴更新假設")],frames=frames,csv=table_csv(["replication","sequential_score","snapshot_score","paired_difference"],zip(range(repeats),seq,alt,diff)))

def resource_objective(x,profit_x,profit_y):
    return profit_x*x[0]+profit_y*x[1]

def lp_vertices(b):
    A=np.array([[2.,1.],[1.,2.],[-1.,0.],[0.,-1.]])
    bounds=np.r_[b,0.,0.];points=[]
    for i in range(4):
        for j in range(i+1,4):
            if abs(np.linalg.det(A[[i,j]]))<1e-10:continue
            x=np.linalg.solve(A[[i,j]],bounds[[i,j]])
            if np.all(A@x<=bounds+1e-9):points.append(x)
    return np.array(points)

def resource_allocation(p,seed,student):
    A=np.array([[2.,1.],[1.,2.]]);b=np.array([p["labor"],p["material"]]);profits=np.array([p["profit_x"],p["profit_y"]])
    sol=linprog(-profits,A_ub=A,b_ub=b,bounds=(0,None),method="highs")
    vertices=lp_vertices(b);scores=vertices@profits;best=vertices[np.argmax(scores)]
    integer_points=np.array([(x,y) for x in range(int(b.min())+1) for y in range(int(b.min())+1) if np.all(A@np.array([x,y])<=b)])
    integer_best=integer_points[np.argmax(integer_points@profits)]
    scenarios=[]
    for factor in [.8,1.,1.2]:
        q=linprog(-profits,A_ub=A,b_ub=b*np.array([factor,1]),bounds=(0,None),method="highs")
        scenarios.append([factor,*q.x,-q.fun])
    infeasible=linprog([-1.,-1.],A_ub=[[1.,1.]],b_ub=[-1.],bounds=(0,None),method="highs")
    unbounded=linprog([-1.,-1.],bounds=(0,None),method="highs")
    eps=.001;pert=linprog(-profits,A_ub=A,b_ub=b+[eps,0],bounds=(0,None),method="highs")
    shadow=-float(sol.ineqlin.marginals[0]);finite=(-pert.fun+sol.fun)/eps
    fig,ax=plt.subplots(figsize=(6.6,3.8));center=vertices.mean(axis=0);ordered=vertices[np.argsort(np.arctan2(vertices[:,1]-center[1],vertices[:,0]-center[0]))]
    ax.fill(ordered[:,0],ordered[:,1],alpha=.25,color="#1f6652",label="Feasible region")
    ax.scatter(*sol.x,marker="*",s=140,color="#a24b32",label="Continuous optimum");ax.scatter(*integer_best,marker="x",s=70,color="#405cad",label="Integer optimum")
    ax.set(xlabel="Product x (units)",ylabel="Product y (units)");ax.legend()
    return dict(metrics={"Optimal x":float(sol.x[0]),"Optimal y":float(sol.x[1]),"Optimal profit":float(-sol.fun),"Your objective at optimum":float(student(sol.x,*profits)),"Integer optimal profit":float(integer_best@profits),"Labor shadow price":shadow,"One-sided finite-difference shadow price":float(finite)},
      checks=[check("Your objective matches profit on all vertices","你的目標函數在所有頂點符合利潤",all(np.isclose(student(v,*profits),v@profits) for v in vertices)),check("Optimal solution satisfies resource limits","最優解滿足資源限制",np.all(A@sol.x<=b+1e-8) and np.all(sol.x>=-1e-8)),check("Solver agrees with independent vertex enumeration","求解器與獨立頂點枚舉一致",np.isclose(-sol.fun,best@profits)),check("Infeasible example is detected","識別不可行案例",infeasible.status==2),check("Unbounded example is detected","識別無界案例",unbounded.status==3)],
      figures=[figure_payload(fig,"Feasible decisions and continuous / integer optima","可行決策與連續／整數最優解")],csv=table_csv(["labor_factor","optimal_x","optimal_y","profit"],scenarios))

def laplacian(u,dx,boundary):
    if boundary=="periodic":return (np.roll(u,-1)-2*u+np.roll(u,1))/dx**2
    result=np.zeros_like(u);result[1:-1]=(u[2:]-2*u[1:-1]+u[:-2])/dx**2
    return result

def diffusion_run(p,student=laplacian):
    n=int(p["cells"]);periodic=p["boundary"]=="periodic";dx=1/n
    x=np.linspace(0,1,n,endpoint=False) if periodic else np.linspace(0,1,n+1)
    initial=1+.5*np.cos(2*np.pi*x) if periodic else np.sin(np.pi*x)
    dt=p["ratio"]*dx*dx/p["diffusivity"];t=time_grid(p["end"],dt);h=t[1]-t[0]
    u=initial.copy();implicit=initial.copy();frames=[u.copy()]
    m=len(x);L=np.column_stack([laplacian(np.eye(m)[:,j],dx,p["boundary"]) for j in range(m)])
    # Precompute the linear propagator; no repeated dense solve per time step.
    propagator=np.linalg.solve(np.eye(m)-h*p["diffusivity"]*L,np.eye(m))
    for i in range(len(t)-1):
        u=u+h*p["diffusivity"]*np.asarray(student(u,dx,p["boundary"]))
        implicit=propagator@implicit
        if not periodic:u[[0,-1]]=0;implicit[[0,-1]]=0
        if i%(max(1,(len(t)-1)//20))==0:frames.append(u.copy())
    exact=1+.5*np.cos(2*np.pi*x)*np.exp(-4*np.pi**2*p["diffusivity"]*p["end"]) if periodic else np.sin(np.pi*x)*np.exp(-np.pi**2*p["diffusivity"]*p["end"])
    return x,initial,u,implicit,exact,float(h*p["diffusivity"]/dx**2)

def diffusion(p,seed,student):
    x,initial,mine,implicit,exact,ratio=diffusion_run(p,student)
    _,_,ref,_,_,_=diffusion_run(p)
    fine={**p,"cells":min(100,int(p["cells"])*2)}
    _,_,f,_,e,_=diffusion_run(fine)
    fixed_mass=lambda a:float(np.trapezoid(a,x))
    mass=lambda a:float(np.mean(a)) if p["boundary"]=="periodic" else fixed_mass(a)
    fig,ax=plt.subplots(figsize=(6.6,3.8));ax.plot(x,initial,":",label="Initial",color="grey");ax.plot(x,exact,label="Analytic mode",color="#1f6652");ax.plot(x,mine,"--",label="Your explicit scheme",color="#a24b32");ax.plot(x,implicit,"-.",label="Backward Euler",color="#405cad")
    ax.set(xlabel="Position x (m)",ylabel="Concentration (arbitrary units)");ax.legend(fontsize=8)
    probe=np.array([0.,1.,4.,9.,0.])
    return dict(metrics={"Effective diffusion number":ratio,"Your max error":float(abs(mine-exact).max()),"Reference max error":float(abs(ref-exact).max()),"Refined reference max error":float(abs(f-e).max()),"Backward Euler max error":float(abs(implicit-exact).max()),"Initial total amount":mass(initial),"Your final total amount":mass(mine)},
      checks=[check("Your spatial operator matches a hand-worked stencil","你的空間算子符合手算差分模板",np.allclose(student(probe,.1,p["boundary"]),laplacian(probe,.1,p["boundary"]))),check("Explicit stability condition D dt / dx² ≤ 1/2","顯式穩定條件 D dt / dx² ≤ 1/2",ratio<=.5+1e-12),check("Your solution remains nonnegative","你的解保持非負",np.all(mine>=-1e-8)),check("Boundary-specific mass balance","符合邊界條件的總量平衡",abs(mass(mine)-mass(initial))<1e-8 if p["boundary"]=="periodic" else mass(mine)<=mass(initial)+1e-8),check("Refining the reference grid reduces error","參照網格加密可降低誤差",abs(f-e).max()<=abs(ref-exact).max()+1e-9)],
      figures=[figure_payload(fig,"Diffusion: analytical mode and numerical approximations","擴散：解析模態與數值近似")],csv=table_csv(["x_m","initial","analytic","your_explicit","backward_euler"],zip(x,initial,exact,mine,implicit)))

REFERENCE_FUNCTIONS={"mixing-tank":tank_rhs,"population-inference":logistic,"sir-dynamics":sir_rhs,"agent-simulation":same_fraction,"resource-allocation":resource_objective,"diffusion":laplacian}
RUNNERS=dict(zip(SLUGS,[mixing_tank,population_inference,sir_dynamics,agent_simulation,resource_allocation,diffusion]))

def run_lesson(slug,params=None,seed=2026,student=None,student_integrator=None):
    if slug not in RUNNERS:raise ValueError("Unknown lesson / 未知單元")
    p={**DEFAULTS[slug],**(params or {})}
    for key,value in p.items():
        if isinstance(value,(float,int)) and not np.isfinite(value):raise ValueError(f"{key}: finite values required / 必須為有限值")
    # Also validate direct Python callers; browser controls are not a validation boundary.
    limits={"flow":(.1,10),"volume":(5,100),"reaction":(0,1),"inlet":(.1,30),"initial":(0,30),"dt":(.05,10),"growth":(.05,.8),"capacity":(20,400),"noise":(0,10),"train_end":(2,16),"beta":(0,1),"gamma":(.02,.5),"intervention":(1,99),"reduction":(0,1),"size":(6,24),"vacancy":(.05,.5),"threshold":(0,1),"sweeps":(1,40),"repeats":(2,24),"labor":(1,80),"material":(1,80),"profit_x":(1,60),"profit_y":(1,60),"cells":(10,50),"diffusivity":(.01,1),"ratio":(.05,1.2),"end":(.02,.5)}
    for k,v in p.items():
        if k in limits and not limits[k][0]<=v<=limits[k][1]:raise ValueError(f"{k}: outside teaching range {limits[k]} / 超出教學範圍")
    for k in ["size","sweeps","repeats","cells"]:
        if k in p and int(p[k])!=p[k]:raise ValueError(f"{k}: integer required / 必須為整數")
    if "boundary" in p and p["boundary"] not in ("fixed","periodic"):raise ValueError("Unknown boundary / 未知邊界")
    plt.close("all")
    plt.rcParams.update({"font.size":9,"axes.spines.top":False,"axes.spines.right":False,"axes.grid":True,"grid.alpha":.15})
    if slug=="mixing-tank":
        result=mixing_tank(p,int(seed),student or tank_rhs,student_integrator or explicit_integrate)
    else:
        result=RUNNERS[slug](p,int(seed),student or REFERENCE_FUNCTIONS[slug])
    result.update(slug=slug,version=VERSION,params=p,seed=int(seed),data_type="synthetic teaching experiment")
    # Nonfinite metrics are an explicit execution failure, not a silently passed run.
    json.dumps(result,allow_nan=False)
    return result

LESSON='resource-allocation'
PARAMS={'labor': 40.0, 'material': 50.0, 'profit_x': 30.0, 'profit_y': 20.0}
SEED=2026
def student_model(x,profit_x,profit_y):
    return profit_x*x[0]+profit_y*x[1]

result = run_lesson(LESSON, PARAMS, SEED, student_model)
print("Experiment complete / 實驗完成")

print(json.dumps(result["metrics"], indent=2))
