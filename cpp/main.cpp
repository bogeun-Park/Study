#include <iostream>
#include <vector>
#include <climits>
#include <queue>
using namespace std;

int t;
int n, m, k;
int u, v, c, d;
vector<pair<int, pair<int, int>>> graph[101];  // graph[u] = <d, <c, v> : 노드 u에서 v까지 갈 때의 비용은 c이고 시간은 d다.
int time[101][10001];  // time[a][b] = c : 노드1에서 a의 비용이 들어 b노드로 가는데의 최소 시간은 c이다.

void dijkstra(int start);

int main() {

	// ios::sync_with_stdio(false);
	cin.tie(NULL);
	cout.tie(NULL);

    cin >> t;
    while(t--) {
        cin >> n >> m >> k;

        for(int i = 0; i <= n; i++)
            graph[i].clear();

        for(int i = 0; i < k; i++) {
            cin >> u >> v >> c >> d;

            graph[u].push_back(make_pair(d, make_pair(c, v)));
        }

        dijkstra(1);

        
    }

    system("pause");
	return 0;
}


void dijkstra(int start) {
    for(int i = 0; i <= n; i++) 
        for(int j = 0; j <= m; j++)
            time[i][j] = INT_MAX;

	priority_queue<pair<int, pair<int, int>>> pq;
	pq.push(make_pair(0, make_pair(0, start)));
    time[0][start] = 0;
	while (!pq.empty()) {
		int clock = -pq.top().first;
		int cost = pq.top().second.first;
        int node = pq.top().second.second;
		pq.pop();

		for (int i = 0;i < graph[node].size();i++) {
			int nclock = graph[node][i].first;
            int ncost = graph[node][i].second.first;
			int nnode = graph[node][i].second.second;

			if (time[ncost][nnode] > clock + nclock) {
				time[ncost][nnode] = clock + nclock;
				pq.push(make_pair(-time[ncost][nnode], make_pair(ncost, nnode)));
			}
		}
	}
}